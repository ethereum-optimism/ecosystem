import type {
  Account,
  HttpTransport,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem'
import { getAddress } from 'viem'
import { type optimism, type optimismSepolia } from 'viem/chains'

import {
  generateListResponse,
  zodCreatedAtCursor,
  zodEthereumAddress,
  zodListRequest,
} from '@/api'
import { SUPPORTED_L2_CHAINS, SUPPORTED_L2_MAINNET_CHAINS } from '@/constants'
import { MAX_REBATE_AMOUNT } from '@/constants/rebates'
import { isPrivyAuthed } from '@/middleware'
import type { DeploymentRebate } from '@/models'
import {
  ContractState,
  DeploymentRebateState,
  getActiveContract,
  getCompletedRebatesForEntityByCursor,
  getDeploymentRebateByContractId,
  getTotalRebatesClaimed,
  getWalletVerifications,
  insertDeploymentRebate,
  setDeploymentRebateToFailed,
  setDeploymentRebateToPending,
  setDeploymentRebateToSent,
} from '@/models'
import { bigIntToNumeric } from '@/models/utils'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { isContractDeploymentDateEligibleForRebate } from '@/utils'

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

      assertUserAuthenticated(user)

      return await getTotalRebatesClaimed({
        db: this.trpc.database,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchTotalRebatesClaimedErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
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

      assertUserAuthenticated(user)

      const completedRebates = await getCompletedRebatesForEntityByCursor({
        db: this.trpc.database,
        entityId: user.entityId,
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

      assertUserAuthenticated(user)

      const contract = await getActiveContract({
        db: this.trpc.database,
        contractId,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
            contractId: contractId,
          },
          'error fetching contract',
        )
        throw Trpc.handleStatus(500, 'error fetching contract')
      })

      if (!contract) {
        throw Trpc.handleStatus(400, 'contract does not exist')
      }

      if (contract.state !== ContractState.VERIFIED) {
        throw Trpc.handleStatus(403, 'cannot claim on unverified contract')
      }

      if (!isContractDeploymentDateEligibleForRebate(contract)) {
        throw Trpc.handleStatus(
          403,
          'contract must be deployed after user signed up for dev console',
        )
      }

      if (!contract.transaction) {
        this.logger?.error(
          {
            entityId: user.entityId,
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
          `chain id: ${contract.chainId} is not supported`,
        )
      }

      const existingRebate = await getDeploymentRebateByContractId({
        db: this.trpc.database,
        contractId,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchDeploymentRebateErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
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
          'a rebate has already been claimed for this contract',
        )
      }

      if (
        existingRebate &&
        existingRebate.state === DeploymentRebateState.PENDING_SEND
      ) {
        throw Trpc.handleStatus(403, 'rebate already pending')
      }

      const cbVerifiedWallets = (
        await getWalletVerifications({
          db: this.trpc.database,
          entityId: user.entityId,
        }).catch((err) => {
          metrics.fetchWalletVerificationsErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: user.entityId,
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
          'must have a cb verified wallet in order to claim rebate',
        )
      }

      const totalAmountAlreadyClaimed = await getTotalRebatesClaimed({
        db: this.trpc.database,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchTotalRebatesClaimedErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
          },
          'error fetching total rebates claimed from db',
        )
        throw Trpc.handleStatus(500, 'error fetching total rebates claimed')
      })

      if (totalAmountAlreadyClaimed >= MAX_REBATE_AMOUNT) {
        throw Trpc.handleStatus(
          403,
          'user has already claimed the max amount of rebates',
        )
      }

      const amountLeftToClaim = MAX_REBATE_AMOUNT - totalAmountAlreadyClaimed

      if (amountLeftToClaim < 0) {
        throw Trpc.handleStatus(
          403,
          'user has already claimed the max amount of rebates',
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
          entityId: user.entityId,
          rebateId: existingRebate.id,
        }).catch((err) => {
          metrics.updateDeploymentRebateToPendingErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: user.entityId,
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
            entityId: user.entityId,
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
              entityId: user.entityId,
              newRebate: {
                entityId: user.entityId,
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

      const isMainnetChain = SUPPORTED_L2_MAINNET_CHAINS.some(
        ({ chain }) => chain.id === contract.chainId,
      )
      const walletClient: WalletClient<
        Transport,
        typeof optimism | typeof optimismSepolia,
        Account
      > = isMainnetChain ? this.walletClient : this.testnetWalletClient

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
              entityId: user.entityId,
              contractId: contractId,
              rebateAmount: amountToSend,
              recipientAddress,
            },
            'error sending rebate tx',
          )
          await setDeploymentRebateToFailed({
            db: this.trpc.database,
            entityId: user.entityId,
            rebateId: pendingRebate.id,
          })
          throw Trpc.handleStatus(500, 'error sending rebate tx')
        })

      const publicClient = isMainnetChain
        ? this.publicClient
        : this.testnetPublicClient

      const rebateTxReceipt = await publicClient
        .waitForTransactionReceipt({
          hash: rebateTxHash,
        })
        .catch(async (err) => {
          metrics.fetchRebateTxReceiptErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: user.entityId,
              contractId: contractId,
              rebateAmount: amountToSend,
              recipientAddress,
              rebateTxHash,
            },
            'error fetching rebate tx receipt',
          )
          await setDeploymentRebateToFailed({
            db: this.trpc.database,
            entityId: user.entityId,
            rebateId: pendingRebate.id,
          })
          throw Trpc.handleStatus(500, 'error fetching rebate tx')
        })

      await setDeploymentRebateToSent({
        db: this.trpc.database,
        entityId: user.entityId,
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
            entityId: user.entityId,
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

      return { txHash: rebateTxReceipt.transactionHash }
    })

  public readonly handler = this.trpc.router({
    [this.totalRebatesClaimed]: this.totalRebatesClaimedController,
    [this.claimDeploymentRebate]: this.claimDeploymentRebateController,
    [this.listCompletedRebates]: this.listCompletedRebatesController,
  })

  constructor(
    trpc: Trpc,
    private readonly walletClient: WalletClient<
      Transport,
      typeof optimism,
      Account
    >,
    private readonly publicClient: PublicClient<HttpTransport, typeof optimism>,
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
}
