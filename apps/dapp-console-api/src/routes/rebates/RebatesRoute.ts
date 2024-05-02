import type {
  Account,
  Address,
  HttpTransport,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem'
import { formatEther, getAddress } from 'viem'
import { type optimism, type optimismSepolia } from 'viem/chains'

import {
  generateListResponse,
  zodCreatedAtCursor,
  zodEthereumAddress,
  zodListRequest,
} from '@/api'
import { SUPPORTED_L2_CHAINS, SUPPORTED_L2_MAINNET_CHAINS } from '@/constants'
import { MAX_REBATE_AMOUNT } from '@/constants/rebates'
import { DappConsoleError } from '@/errors/DappConsoleError'
import { isPrivyAuthed } from '@/middleware'
import type { Contract, DeploymentRebate, Entity } from '@/models'
import {
  ContractState,
  DeploymentRebateState,
  getActiveContract,
  getCompletedRebatesForEntityByCursor,
  getDeploymentRebateByContractId,
  getTotalRebatesClaimed,
  getWalletsByEntityId,
  getWalletVerifications,
  insertDeploymentRebate,
  setDeploymentRebateToFailed,
  setDeploymentRebateToPending,
  setDeploymentRebateToSent,
} from '@/models'
import { bigIntToNumeric } from '@/models/utils'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import {
  checkIfSanctionedAddress,
  isContractDeploymentDateEligibleForRebate,
} from '@/utils'

import { DEFAULT_PAGE_LIMIT } from '../constants'
import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class RebatesRoute extends Route {
  public readonly name = 'Rebates' as const

  public readonly totalRebatesClaimed = 'totalRebatesClaimed' as const
  public readonly totalRebatesClaimedController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .query(async ({ ctx }) => {
      const { user } = ctx.session

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      return await getTotalRebatesClaimed({
        db: this.trpc.database,
        entityId,
      }).catch((err) => {
        metrics.fetchTotalRebatesClaimedErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
          },
          'error fetching total rebates claimed from db',
        )
        throw Trpc.handleStatus(500, 'error fetching total rebates claimed')
      })
    })

  /**
   * Returns a list of completed rebates
   */
  public readonly listCompletedRebates = 'listCompletedRebates'
  public readonly listCompletedRebatesController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(zodListRequest(zodCreatedAtCursor))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session
      const limit = input.limit ?? DEFAULT_PAGE_LIMIT
      const { cursor } = input

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const completedRebates = await getCompletedRebatesForEntityByCursor({
        db: this.trpc.database,
        entityId,
        limit,
        cursor,
      }).catch((err) => {
        metrics.fetchCompletedRebatesListErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
          },
          'error fetching completed rebates for entity',
        )
        throw Trpc.handleStatus(
          500,
          'error fetching completed rebates for entity',
        )
      })

      return generateListResponse(completedRebates, limit, cursor)
    })

  public readonly claimDeploymentRebate = 'claimDeploymentRebate'
  public readonly claimDeploymentRebateController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        contractId: this.z.string(),
        recipientAddress: zodEthereumAddress,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { contractId } = input
      const recipientAddress = getAddress(input.recipientAddress)

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const contract = await getActiveContract({
        db: this.trpc.database,
        contractId,
        entityId,
      }).catch((err) => {
        metrics.fetchContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            contractId: contractId,
          },
          'error fetching contract',
        )
        throw Trpc.handleStatus(500, 'error fetching contract')
      })

      if (!contract) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'CONTRACT_DOES_NOT_EXIST',
          }),
        )
      }

      if (contract.state !== ContractState.VERIFIED) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({
            code: 'UNVERIFIED_CONTRACT',
          }),
        )
      }

      if (!isContractDeploymentDateEligibleForRebate(contract)) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({
            code: 'INELIGIBLE_CONTRACT',
          }),
        )
      }

      if (!contract.transaction) {
        this.logger?.error(
          {
            entityId,
            contractId: contractId,
          },
          'no deployment transaction associated with contract',
        )
        throw Trpc.handleStatus(
          500,
          'no deployment transaction associated with contract',
        )
      }

      const isSupportedChain = SUPPORTED_L2_CHAINS.some(
        ({ chain }) => chain.id === contract.chainId,
      )
      if (!isSupportedChain) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({ code: 'UNSUPPORTED_CHAIN_ID' }),
        )
      }

      const existingRebate = await getDeploymentRebateByContractId({
        db: this.trpc.database,
        contractId,
        entityId,
      }).catch((err) => {
        metrics.fetchDeploymentRebateErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            contractId: contractId,
          },
          'error fetching deployment rebate status',
        )
        throw Trpc.handleStatus(500, 'error fetching deployment rebate status')
      })

      if (
        existingRebate &&
        existingRebate.state === DeploymentRebateState.REBATE_SENT
      ) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({ code: 'REBATE_ALREADY_CLAIMED' }),
        )
      }

      if (
        existingRebate &&
        existingRebate.state === DeploymentRebateState.PENDING_SEND
      ) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({ code: 'REBATE_PENDING' }),
        )
      }

      const cbVerifiedWallets = (
        await getWalletVerifications({
          db: this.trpc.database,
          entityId,
        }).catch((err) => {
          metrics.fetchWalletVerificationsErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              contractId,
            },
            'error fetching verifications for wallet',
          )
          throw Trpc.handleStatus(
            500,
            'error fetching verifications for wallet',
          )
        })
      ).cbVerifiedWallets

      if (cbVerifiedWallets.length === 0) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({ code: 'NOT_CB_VERIFIED' }),
        )
      }

      await this.screenAddresses({ entityId, recipientAddress, contract })

      const totalAmountAlreadyClaimed = await getTotalRebatesClaimed({
        db: this.trpc.database,
        entityId,
      }).catch((err) => {
        metrics.fetchTotalRebatesClaimedErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
          },
          'error fetching total rebates claimed from db',
        )
        throw Trpc.handleStatus(500, 'error fetching total rebates claimed')
      })

      if (totalAmountAlreadyClaimed >= MAX_REBATE_AMOUNT) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({
            code: 'MAX_REBATE_REACHED',
          }),
        )
      }

      const amountLeftToClaim = MAX_REBATE_AMOUNT - totalAmountAlreadyClaimed

      if (amountLeftToClaim < 0) {
        throw Trpc.handleStatus(
          403,
          new DappConsoleError({
            code: 'MAX_REBATE_REACHED',
          }),
        )
      }

      const gasPaidForDeployment =
        BigInt(contract.transaction.gasUsed) *
        BigInt(contract.transaction.gasPrice)
      const amountToSend =
        gasPaidForDeployment < amountLeftToClaim
          ? gasPaidForDeployment
          : amountLeftToClaim

      let pendingRebate: DeploymentRebate
      if (existingRebate) {
        pendingRebate = await setDeploymentRebateToPending({
          db: this.trpc.database,
          entityId,
          rebateId: existingRebate.id,
        }).catch((err) => {
          metrics.updateDeploymentRebateToPendingErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              rebateId: existingRebate.id,
            },
            'error updating rebate to pending',
          )
          throw Trpc.handleStatus(500, 'error updating rebate')
        })
      } else {
        pendingRebate = await insertDeploymentRebate({
          db: this.trpc.database,
          newRebate: {
            entityId,
            contractId,
            contractAddress: contract.contractAddress,
            chainId: contract.chainId,
            state: DeploymentRebateState.PENDING_SEND,
            recipientAddress,
            verifiedWallets: cbVerifiedWallets.map((wallet) =>
              getAddress(wallet.address),
            ),
          },
        }).catch((err) => {
          metrics.insertPendingDeploymentRebateErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              newRebate: {
                entityId,
                contractId,
                contractAddress: contract.contractAddress,
                chainId: contract.chainId,
                state: DeploymentRebateState.PENDING_SEND,
                recipientAddress,
                verifiedWallets: cbVerifiedWallets.map((wallet) =>
                  getAddress(wallet.address),
                ),
              },
            },
            'error creating pending rebate',
          )
          throw Trpc.handleStatus(500, 'error creating rebate')
        })
      }

      const isMainnetDeployment = SUPPORTED_L2_MAINNET_CHAINS.some(
        ({ chain }) => chain.id === contract.chainId,
      )
      const walletClient: WalletClient<
        Transport,
        typeof optimism | typeof optimismSepolia,
        Account
      > = isMainnetDeployment
        ? this.mainnetWalletClient
        : this.testnetWalletClient
      const publicClient = isMainnetDeployment
        ? this.mainnetPublicClient
        : this.testnetPublicClient

      await this.updateWalletBalance(publicClient, walletClient).catch(
        (err) => {
          metrics.updateDeploymentRebateWalletBalanceErrorCount.inc({
            chainId: publicClient.chain.id,
          })
          this.logger?.error(
            {
              error: err,
              walletAddress: walletClient.account.address,
              chainId: publicClient.chain.id,
            },
            'error updating deployment rebate wallet balance',
          )
        },
      )

      const rebateTxHash = await walletClient
        .sendTransaction({
          to: recipientAddress,
          value: amountToSend,
        })
        .catch(async (err) => {
          metrics.sendRebateTxErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              contractId: contractId,
              rebateAmount: amountToSend,
              recipientAddress,
            },
            'error sending rebate tx',
          )
          await setDeploymentRebateToFailed({
            db: this.trpc.database,
            entityId,
            rebateId: pendingRebate.id,
          })
          throw Trpc.handleStatus(
            500,
            new DappConsoleError({ code: 'FAILED_TO_SEND_REBATE' }),
          )
        })

      const rebateTxReceipt = await publicClient
        .waitForTransactionReceipt({
          hash: rebateTxHash,
        })
        .catch(async (err) => {
          metrics.fetchRebateTxReceiptErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              contractId: contractId,
              rebateAmount: amountToSend,
              recipientAddress,
              rebateTxHash,
            },
            'error fetching rebate tx receipt',
          )
          await setDeploymentRebateToFailed({
            db: this.trpc.database,
            entityId,
            rebateId: pendingRebate.id,
          })
          throw Trpc.handleStatus(
            500,
            new DappConsoleError({ code: 'FAILED_TO_SEND_REBATE' }),
          )
        })

      await setDeploymentRebateToSent({
        db: this.trpc.database,
        entityId,
        rebateId: pendingRebate.id,
        update: {
          rebateTxHash: rebateTxReceipt.transactionHash,
          rebateAmount: bigIntToNumeric(amountToSend),
          rebateTxTimestamp: new Date(),
        },
      }).catch((err) => {
        metrics.updateCompletedDeploymentRebateErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            rebateId: pendingRebate.id,
            update: {
              rebateTxHash: rebateTxReceipt.transactionHash,
              rebateAmount: amountToSend,
            },
          },
          'error updating deployment rebate to completed',
        )
        throw Trpc.handleStatus(500, 'unknown server error')
      })

      await this.updateWalletBalance(publicClient, walletClient).catch(
        (err) => {
          metrics.updateDeploymentRebateWalletBalanceErrorCount.inc({
            chainId: publicClient.chain.id,
          })
          this.logger?.error(
            {
              error: err,
              walletAddress: walletClient.account.address,
              chainId: publicClient.chain.id,
            },
            'error updating deployment rebate wallet balance',
          )
        },
      )

      return { txHash: rebateTxReceipt.transactionHash }
    })

  public readonly handler = this.trpc.router({
    [this.totalRebatesClaimed]: this.totalRebatesClaimedController,
    [this.claimDeploymentRebate]: this.claimDeploymentRebateController,
    [this.listCompletedRebates]: this.listCompletedRebatesController,
  })

  constructor(
    trpc: Trpc,
    private readonly mainnetWalletClient: WalletClient<
      Transport,
      typeof optimism,
      Account
    >,
    private readonly mainnetPublicClient: PublicClient<
      HttpTransport,
      typeof optimism
    >,
    private readonly testnetWalletClient: WalletClient<
      Transport,
      typeof optimismSepolia,
      Account
    >,
    private readonly testnetPublicClient: PublicClient<
      HttpTransport,
      typeof optimismSepolia
    >,
  ) {
    super(trpc)
  }

  private async screenAddresses(input: {
    entityId: Entity['id']
    recipientAddress: Address
    contract: Contract
  }) {
    const { entityId, recipientAddress, contract } = input
    const wallets = await getWalletsByEntityId(this.trpc.database, entityId)
    const walletAddressScreeningResults = await Promise.all(
      wallets.map((wallet) =>
        checkIfSanctionedAddress({
          db: this.trpc.database,
          entityId,
          address: wallet.address,
        }),
      ),
    ).catch((err) => {
      this.logger?.error(
        {
          err,
          entityId,
        },
        'error screening wallets',
      )
      throw Trpc.handleStatus(500, 'error screening address')
    })

    if (walletAddressScreeningResults.some((result) => !!result)) {
      throw Trpc.handleStatus(
        401,
        new DappConsoleError({ code: 'SANCTIONED_ADDRESS' }),
      )
    }

    const recipientAddressIsSanctioned = await checkIfSanctionedAddress({
      db: this.trpc.database,
      entityId,
      address: recipientAddress,
    }).catch((err) => {
      this.logger?.error(
        {
          err,
          entityId,
        },
        'error screening recipient address',
      )
      throw Trpc.handleStatus(500, 'error screening recipient address')
    })

    if (recipientAddressIsSanctioned) {
      throw Trpc.handleStatus(
        401,
        new DappConsoleError({ code: 'SANCTIONED_ADDRESS' }),
      )
    }

    const deployerAddressIsSanctioned = await checkIfSanctionedAddress({
      db: this.trpc.database,
      entityId,
      address: contract.deployerAddress,
    }).catch((err) => {
      this.logger?.error(
        {
          err,
          entityId,
        },
        'error screening deployer address',
      )
      throw Trpc.handleStatus(500, 'error screening deployer address')
    })

    if (deployerAddressIsSanctioned) {
      throw Trpc.handleStatus(
        401,
        new DappConsoleError({ code: 'SANCTIONED_ADDRESS' }),
      )
    }
  }

  private async updateWalletBalance(
    publicClient: PublicClient<
      HttpTransport,
      typeof optimism | typeof optimismSepolia
    >,
    walletClient: WalletClient<
      Transport,
      typeof optimism | typeof optimismSepolia,
      Account
    >,
  ) {
    const walletBalance = await publicClient
      .getBalance({ address: walletClient.account.address })
      .catch((err) => {
        metrics.updateDeploymentRebateWalletBalanceErrorCount.inc({
          chainId: publicClient.chain.id,
        })
        this.logger?.error(
          {
            error: err,
            walletAddress: walletClient.account.address,
            chainId: publicClient.chain.id,
          },
          'error updating deployment rebate wallet balance',
        )
      })
    if (typeof walletBalance === 'bigint') {
      metrics.deploymentRebateWalletBalance.set(
        { chainId: publicClient.chain.id },
        +formatEther(walletBalance),
      )
    }
  }
}
