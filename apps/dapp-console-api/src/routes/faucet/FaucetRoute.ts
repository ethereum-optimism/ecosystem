import { TRPCError } from '@trpc/server'
import type { IronSession } from 'iron-session'
import type { Hex } from 'viem'
import { keccak256, parseEther, stringToHex, verifyMessage } from 'viem'
import type { Address } from 'viem/accounts'
import { sepolia } from 'viem/chains'

import { zodEthereumAddress, zodEthereumSignature } from '@/api'
import type { SessionData } from '@/constants'
import { envVars } from '@/constants'
import { isPrivyAuthed } from '@/middleware'
import { metrics } from '@/monitoring/metrics'
import type { Trpc } from '@/Trpc'

import { getCoinbaseVerificationAttestationFromEAS } from '../../utils/coinbaseVerification'
import type { Faucet, FaucetAuthMode } from '../../utils/Faucet'
import { faucetAuthModes, ON_CHAIN_AUTH_MODES } from '../../utils/Faucet'
import { getGitcoinPassportAttestation } from '../../utils/getGitcoinPassportAttestation'
import { getTempFaucetAccessAttestation } from '../../utils/getTempFaucetAccessAttestation'
import { Route } from '../Route'

type FaucetError = 'TIMEOUT_NOT_ELAPSED' | 'GENERIC_ERROR'

export type FaucetClaim = {
  chainId: number
  tx?: Hex
  etherscanUrl?: string
  error?: FaucetError
  amountDistributed?: bigint
  recipientAddress: Address
  requestingWalletAddress?: Address
  authMode: FaucetAuthMode
}

/**
 * Route that handles requests for faucet funds.
 */
export class FaucetRoute extends Route {
  private static readonly LOG_TAG = '[FaucetRoute]'
  public readonly name = 'faucet' as const

  public readonly faucetsInfo = 'faucetsInfo' as const
  public readonly faucetsInfoController = this.trpc.procedure.query(
    async () => {
      return Promise.all(
        this.faucets.map(async (faucet) => {
          let isFaucetAvailable: boolean = true
          try {
            const faucetBalance = await faucet.getFaucetBalance()
            // If the faucet balance has not been fetched and returns null
            // assume that the faucet is available to claim from.
            isFaucetAvailable =
              faucetBalance === null || faucetBalance >= parseEther('1.0')
          } catch (e) {
            this.logger?.error(
              `${FaucetRoute.LOG_TAG} Failed to fetch faucet balance for chain ${faucet.chainId}: ${e.message}`,
              e,
            )
            metrics.faucetFetchBalanceFailures.inc({
              chainId: faucet.chainId,
            })
          }
          return {
            displayName: faucet.displayName,
            chainId: faucet.chainId,
            isAvailable: isFaucetAvailable,
            onChainDripAmount: faucet.onChainDripAmount,
            offChainDripAmount: faucet.offChainDripAmount,
          }
        }),
      )
    },
  )

  public readonly nextDripsRoute = 'nextDrips' as const
  /// Returns the seconds until the next drip can occur. If
  /// no timeout exists for a chain then the value for that chain will be set to null.
  public readonly nextDripsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        authMode: this.z
          .enum(faucetAuthModes)
          .describe('The authentication mode used for the drip'),
        walletAddress: zodEthereumAddress.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { authMode, walletAddress } = input
      const userId = this.getUserIdForAuthMode(
        ctx.session,
        authMode,
        walletAddress as Address | undefined,
      )

      const faucet = this.faucets.find((f) => f.chainId === sepolia.id)

      if (!faucet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No faucet found for Sepolia`,
        })
      }

      try {
        const secondsUntilNextDrip = await faucet.secondsUntilNextDrip(
          authMode,
          userId as Hex,
        )
        return { secondsUntilNextDrip }
      } catch (e) {
        this.logger?.error(
          `${FaucetRoute.LOG_TAG} Failed to fetch last drip: ${e.message}`,
          e,
        )
        metrics.faucetFetchLastDripFailures.inc()
        return {
          secondsUntilNextDrip: undefined,
        }
      }
    })

  public readonly onChainClaimsRoute = 'onChainClaims' as const
  public readonly onChainClaimsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z
        .object({
          chainId: this.z.number().describe('The chain to request a drip on'),
          authMode: this.z
            .enum(faucetAuthModes)
            .describe('The authentication mode used for the drip'),
          recipientAddress: zodEthereumAddress,
          ownerAddress: zodEthereumAddress,
          signature: zodEthereumSignature.optional(),
        })
        .refine((obj) => ON_CHAIN_AUTH_MODES.includes(obj.authMode), {
          message: 'Authentication mode is not a supported on-chain mode',
        })
        .refine((obj) => obj.authMode === 'WORLD_ID' || !!obj.signature, {
          message: 'Signature from owner is required',
        }),
    )
    .mutation<FaucetClaim>(async ({ ctx, input }) => {
      const ownerAddress = input.ownerAddress as Address
      const recipientAddress = input.recipientAddress as Address
      const signature = input.signature as Hex
      const { chainId, authMode } = input

      if (authMode !== 'WORLD_ID') {
        await this.verifySignedMessage(
          ownerAddress,
          recipientAddress,
          signature,
        )
      }

      switch (authMode) {
        case 'ATTESTATION':
          await this.checkTemporaryAttestation(ownerAddress)
          break
        case 'COINBASE_VERIFICATION':
          await this.checkCoinbaseVerificationAttestation(ownerAddress)
          break
        case 'GITCOIN_PASSPORT':
          await this.checkGitcoinPassportAttestation(ownerAddress)
          break
        case 'WORLD_ID':
          await this.verifyWorldIdUserLoggedIn(ctx.session)
          break
        default:
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication mode is not supported',
          })
      }

      const faucet = this.faucets.find((f) => f.chainId === chainId)

      if (!faucet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No faucet found for chainId ${chainId}`,
        })
      }

      let tx: Hex | undefined
      let error: FaucetError | undefined
      try {
        tx = await faucet.triggerFaucetDrip({
          userId: this.getUserIdForAuthMode(
            ctx.session,
            authMode,
            ownerAddress,
          ),
          recipientAddress,
          authMode,
        })
      } catch (err) {
        error = this.handleFaucetDripError(err, faucet.chainId)
        return {
          chainId: faucet.chainId,
          error,
          recipientAddress,
          requestingWalletAddress: ownerAddress,
          authMode,
        }
      }
      return {
        chainId: faucet.chainId,
        tx,
        etherscanUrl: faucet.getBlockExplorerUrlTx(tx),
        error,
        amountDistributed: faucet.onChainDripAmount,
        recipientAddress,
        requestingWalletAddress: ownerAddress,
        authMode,
      }
    })

  public readonly offChainClaimsRoute = 'offChainClaims' as const
  public readonly offChainClaimsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z
        .object({
          chainId: this.z.number().describe('The chains to request a drip on'),
          authMode: this.z
            .enum(faucetAuthModes)
            .describe('The authentication mode used for the drip'),
          recipientAddress: zodEthereumAddress,
        })
        .refine((obj) => !ON_CHAIN_AUTH_MODES.includes(obj.authMode), {
          message: 'Authentication mode is not a supported off-chain mode',
        }),
    )
    .mutation<FaucetClaim>(async ({ ctx, input }) => {
      const recipientAddress = input.recipientAddress as Address
      const { chainId, authMode } = input

      switch (authMode) {
        case 'PRIVY':
          break
        default:
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Authentication mode is not supported',
          })
      }

      const faucet = this.faucets.find((f) => f.chainId === chainId)

      if (!faucet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No faucet found for chainId ${chainId}`,
        })
      }

      let tx: Hex | undefined
      let error: FaucetError | undefined
      try {
        tx = await faucet.triggerFaucetDrip({
          userId: this.getUserIdForAuthMode(ctx.session, authMode),
          recipientAddress,
          authMode,
        })
      } catch (err) {
        error = this.handleFaucetDripError(err, faucet.chainId)
        return {
          chainId: faucet.chainId,
          error,
          recipientAddress,
          authMode,
        }
      }
      return {
        chainId: faucet.chainId,
        tx,
        etherscanUrl: tx && faucet.getBlockExplorerUrlTx(tx),
        error,
        amountDistributed: faucet.offChainDripAmount,
        recipientAddress,
        authMode,
      }
    })

  public readonly handler = this.trpc.router({
    [this.faucetsInfo]: this.faucetsInfoController,
    [this.nextDripsRoute]: this.nextDripsController,
    [this.onChainClaimsRoute]: this.onChainClaimsController,
    [this.offChainClaimsRoute]: this.offChainClaimsController,
  })

  constructor(
    trpc: Trpc,
    private readonly faucets: Faucet[],
  ) {
    super(trpc)
  }

  /// The user id to store on-chain for tracking the last time a user that authed with
  /// github received a faucet drip.
  private readonly getUserIdForPrivyAuth = (userId: string) =>
    keccak256(stringToHex(userId))

  /// The user id to store on-chain for tracking the last time a user that authed with
  /// the optimist nft received a faucet drip.
  private readonly getUserIdForWalletAuth = (ownerAddress: Address) =>
    keccak256(ownerAddress)

  /// The user id to store on-chain for tracking the last time a user that authed with
  /// worldId received a faucet drip.
  private readonly getUserIdForWorldIdAuth = (nullifierHash: string) =>
    keccak256(nullifierHash as Hex)

  private readonly getUserIdForAuthMode = (
    session: IronSession<SessionData>,
    authMode: FaucetAuthMode,
    walletAddress?: Address,
  ) => {
    switch (authMode) {
      case 'PRIVY':
        if (!session.user || !session.user.privyDid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User is not logged into github',
          })
        }
        return this.getUserIdForPrivyAuth(session.user.privyDid)
      case 'ATTESTATION':
        if (!walletAddress) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User does not have valid wallet addres',
          })
        }
        return this.getUserIdForWalletAuth(walletAddress)
      case 'COINBASE_VERIFICATION':
        if (!walletAddress) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User does not have valid wallet addres',
          })
        }
        return this.getUserIdForWalletAuth(walletAddress)
      case 'GITCOIN_PASSPORT':
        if (!walletAddress) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User does not have valid wallet addres',
          })
        }
        return this.getUserIdForWalletAuth(walletAddress)
      case 'WORLD_ID':
        const { worldIdUser } = session
        if (!worldIdUser?.isVerified) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User is not verified via WorldId',
          })
        }
        return this.getUserIdForWorldIdAuth(worldIdUser.nullifierHash)
    }
  }

  private readonly checkTemporaryAttestation = async (
    ownerAddress: Address,
  ) => {
    // Checks if user is attested for Optimism Faucet access by an allowlisted attester
    const attestersArray = envVars.FAUCET_ACCESS_ATTESTERS

    if (!attestersArray || attestersArray.length === 0) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `No valid attestors were found`,
      })
    }

    const tempFaucetAttestation = await getTempFaucetAccessAttestation(
      ownerAddress,
      attestersArray,
    )

    if (!tempFaucetAttestation) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Address ${ownerAddress} does not have a valid Temporary Attestation`,
      })
    }
  }

  private readonly checkCoinbaseVerificationAttestation = async (
    ownerAddress: Address,
  ) => {
    const coinbaseVerificationAttestation =
      await getCoinbaseVerificationAttestationFromEAS(ownerAddress)

    if (!coinbaseVerificationAttestation) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Address ${ownerAddress} does not have a valid Attestation`,
      })
    }
  }

  private readonly checkGitcoinPassportAttestation = async (
    ownerAddress: Address,
  ) => {
    const gitcoinPassportAttestation =
      await getGitcoinPassportAttestation(ownerAddress)
    if (
      !gitcoinPassportAttestation ||
      gitcoinPassportAttestation.score?.profileScore <= 25
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Address ${ownerAddress} does not have a valid Attestation`,
      })
    }
  }

  private readonly verifyWorldIdUserLoggedIn = async (
    session: IronSession<SessionData>,
  ) => {
    const { worldIdUser } = session

    if (!worldIdUser?.isVerified) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not logged into github',
      })
    }
  }

  private readonly verifySignedMessage = async (
    ownerAddress: Address,
    recipientAddress: Address,
    signature: Hex,
  ) => {
    const isSignatureVerified = await verifyMessage({
      address: ownerAddress,
      message:
        `You need to sign a message to prove you are the owner of ${ownerAddress} and are ` +
        `sending testnet tokens to ${recipientAddress}`,
      signature: signature,
    })

    if (!isSignatureVerified) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Signature address does not match address of owner',
      })
    }
  }

  private readonly handleFaucetDripError = (
    error: { details?: string },
    chainId: number,
  ): FaucetError => {
    const errorDetails = error.details ?? ''
    if (
      errorDetails.includes &&
      errorDetails.includes(
        'Faucet: auth cannot be used yet because timeout has not elapsed',
      )
    ) {
      metrics.faucetTtlFailure.inc({
        chainId,
      })
      return 'TIMEOUT_NOT_ELAPSED'
    } else {
      console.error('Error while triggering faucet drip', error)
      metrics.faucetGenericDripFailures.inc({
        chainId,
      })
      return 'GENERIC_ERROR'
    }
  }
}
