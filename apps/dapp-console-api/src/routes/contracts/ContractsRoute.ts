import type { Address } from 'viem'
import { getAddress } from 'viem'

import {
  zodEthereumAddress,
  zodEthereumSignature,
  zodEthereumTransactionHash,
  zodSupportedChainId,
} from '@/api'
import { supportedChainsPublicClientsMap } from '@/constants'
import { DappConsoleError } from '@/errors/DappConsoleError'
import { isPrivyAuthed } from '@/middleware'
import {
  ChallengeState,
  completeChallenge,
  ContractState,
  deleteContract,
  getActiveContract,
  getActiveContractsForApp,
  getChallengeByChallengeId,
  getContractByAddressAndChainId,
  getUnexpiredChallenge,
  hasAlreadyVerifiedDeployer,
  insertChallenge,
  insertContract,
  insertTransaction,
  restoreDeletedContract,
  verifyContract,
  viemContractDeploymentTransactionToDbTransaction,
} from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import {
  addRebateEligibilityToContract,
  addressEqualityCheck,
  generateChallenge,
} from '@/utils'

import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class ContractsRoute extends Route {
  public readonly name = 'Contracts' as const

  public readonly listContractsForApp = 'listContractsForApp' as const
  /**
   * Returns a list of contracts associated with an app.
   */
  public readonly listContractsForAppController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        appId: this.z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const contracts = await getActiveContractsForApp({
        db: this.trpc.database,
        entityId,
        appId: input.appId,
      }).catch((err) => {
        metrics.listContractsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
          },
          'error fetching contracts from db',
        )
        throw Trpc.handleStatus(500, 'error fetching contracts')
      })

      return contracts.map((contract) =>
        addRebateEligibilityToContract(contract),
      )
    })

  public readonly createContract = 'createContract' as const
  public readonly createContractController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        contractAddress: zodEthereumAddress,
        deploymentTxHash: zodEthereumTransactionHash,
        deployerAddress: zodEthereumAddress,
        chainId: zodSupportedChainId,
        appId: this.z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { deploymentTxHash, chainId, appId } = input
      const inputContractAddress = getAddress(input.contractAddress)
      const inputDeployerAddress = getAddress(input.deployerAddress)

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const publicClient = supportedChainsPublicClientsMap[chainId]

      if (!publicClient) {
        throw Trpc.handleStatus(400, 'chain not supported')
      }

      const deploymentTx = await publicClient
        .getTransaction({
          hash: deploymentTxHash,
        })
        .catch((err) => {
          metrics.fetchingTxErrorCount.inc({ chainId })
          this.logger?.error(
            {
              error: err,
              entityId,
              txHash: deploymentTxHash,
              chainId,
            },
            'error fetching tx',
          )
          throw Trpc.handleStatus(
            400,
            new DappConsoleError({
              code: 'DEPLOYMENT_TX_NOT_FOUND',
            }),
          )
        })
      const deploymentTxReceipt = await publicClient
        .getTransactionReceipt({
          hash: deploymentTxHash,
        })
        .catch((err) => {
          metrics.fetchingTxErrorCount.inc({ chainId })
          this.logger?.error(
            {
              error: err,
              entityId,
              txHash: deploymentTxHash,
              chainId,
            },
            'error fetching tx receipt',
          )
          throw Trpc.handleStatus(
            400,
            new DappConsoleError({
              code: 'DEPLOYMENT_TX_NOT_FOUND',
            }),
          )
        })
      const deploymentBlock = await publicClient
        .getBlock({
          blockHash: deploymentTx.blockHash,
        })
        .catch((err) => {
          metrics.fetchingTxErrorCount.inc({ chainId })
          this.logger?.error(
            {
              error: err,
              entityId,
              txHash: deploymentTxHash,
              chainId,
            },
            'error fetching tx deployment block',
          )
          throw Trpc.handleStatus(
            400,
            new DappConsoleError({
              code: 'DEPLOYMENT_TX_NOT_FOUND',
            }),
          )
        })

      let txContractAddresses: Address[] = deploymentTxReceipt.contractAddress
        ? [deploymentTxReceipt.contractAddress]
        : []
      if (txContractAddresses.length === 0) {
        const tracedTransaction = await publicClient
          .traceTransaction(deploymentTxHash)
          .catch((err) => {
            metrics.traceTxErrorCount.inc({ chainId })
            this.logger?.error(
              {
                error: err,
                entityId,
                txHash: deploymentTxHash,
                chainId,
              },
              'unable to trace transaction',
            )
            throw Trpc.handleStatus(
              500,
              'error fetching deployment transaction',
            )
          })

        if (tracedTransaction.calls) {
          const create2Transactions = tracedTransaction.calls.filter(
            (call) => call.type === 'CREATE2',
          )
          txContractAddresses = create2Transactions.map(
            (create2Transaction) => create2Transaction.to,
          )
        }
      }

      if (txContractAddresses.length === 0) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'DEPLOYMENT_CONTRACT_NOT_FOUND',
          }),
        )
      }

      if (
        !addressEqualityCheck(deploymentTxReceipt.from, inputDeployerAddress)
      ) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'DEPLOYER_ADDRESS_INCORRECT',
          }),
        )
      }

      if (
        !txContractAddresses.some((txContractAddress) =>
          addressEqualityCheck(txContractAddress, inputContractAddress),
        )
      ) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'DEPLOYMENT_CONTRACT_ADDRESS_INCORRECT',
          }),
        )
      }

      const result = await this.trpc.database.transaction(async (tx) => {
        const isDeployerVerified = await hasAlreadyVerifiedDeployer({
          db: tx,
          entityId,
          deployerAddress: inputDeployerAddress,
        })

        const existingContract = await getContractByAddressAndChainId({
          db: tx,
          contractAddress: inputContractAddress,
          chainId,
          entityId,
        })
        if (
          existingContract &&
          existingContract.state !== ContractState.DELETED
        ) {
          throw Trpc.handleStatus(
            400,
            new DappConsoleError({
              code: 'DEPLOYMENT_CONTRACT_ALREADY_EXISTS',
            }),
          )
        }

        if (existingContract) {
          const restoredContract = await restoreDeletedContract({
            db: tx,
            contractId: existingContract.id,
            appId,
            state: isDeployerVerified
              ? ContractState.VERIFIED
              : ContractState.NOT_VERIFIED,
          }).catch((err) => {
            metrics.restoreDeletedContractErrorCount.inc()
            this.logger?.error(
              {
                error: err,
                entityId,
                contractId: existingContract.id,
                appId,
                chainId,
              },
              'error restoring deleted contract',
            )
            throw Trpc.handleStatus(500, 'error restoring deleted contract')
          })
          return restoredContract
        } else {
          const contract = await insertContract({
            db: tx,
            contract: {
              contractAddress: inputContractAddress,
              deploymentTxHash,
              deployerAddress: inputDeployerAddress,
              chainId,
              appId,
              state: isDeployerVerified
                ? ContractState.VERIFIED
                : ContractState.NOT_VERIFIED,
              entityId,
            },
          }).catch((err) => {
            metrics.insertContractErrorCount.inc()
            this.logger?.error(
              {
                error: err,
                contractAddress: inputContractAddress,
                deploymentTxHash,
                deployerAddress: inputDeployerAddress,
                chainId,
                appId,
                state: isDeployerVerified
                  ? ContractState.VERIFIED
                  : ContractState.NOT_VERIFIED,
                entityId,
              },
              'error inserting new contract',
            )
            throw Trpc.handleStatus(500, 'error creating contract')
          })
          await insertTransaction({
            db: tx,
            transaction: viemContractDeploymentTransactionToDbTransaction({
              transactionReceipt: deploymentTxReceipt,
              transaction: deploymentTx,
              entityId,
              chainId,
              contractId: contract.id,
              deploymentTimestamp: deploymentBlock.timestamp,
            }),
          }).catch((err) => {
            metrics.insertDeploymentTransactionErrorCount.inc()
            this.logger?.error(
              {
                error: err,
                contractAddress: inputContractAddress,
                deploymentTxHash,
                deployerAddress: inputDeployerAddress,
                contractId: contract.id,
                chainId,
                appId,
                entityId,
              },
              'error inserting new deployment transaction',
            )
            throw Trpc.handleStatus(500, 'error creating contract')
          })
          return contract
        }
      })

      return { result }
    })

  public readonly startVerification = 'startVerification' as const
  public readonly startVerificationController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        contractId: this.z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { contractId } = input
      const { user } = ctx.session

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
            contractId,
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

      const challenge = await getUnexpiredChallenge({
        db: this.trpc.database,
        entityId,
        contractId,
      }).catch((err) => {
        metrics.fetchChallengeErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            contractId,
          },
          'error fetching unexpired challenge',
        )
        throw Trpc.handleStatus(500, 'error fetching challenge')
      })

      const challengeToComplete = generateChallenge(contract.deployerAddress)

      if (challenge) {
        return {
          ...challenge,
          challenge: challengeToComplete,
        }
      }

      const result = await insertChallenge({
        db: this.trpc.database,
        challenge: {
          entityId,
          contractId,
          address: contract.deployerAddress,
          chainId: contract.chainId,
          state: ChallengeState.PENDING,
        },
      }).catch((err) => {
        metrics.insertChallengeErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            contractId,
          },
          'error inserting challenge',
        )
        throw Trpc.handleStatus(500, 'error creating challenge')
      })

      return { ...result, challenge: challengeToComplete }
    })

  public readonly completeVerification = 'completeVerification' as const
  public readonly completeVerificationController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        challengeId: this.z.string(),
        signature: zodEthereumSignature,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { challengeId, signature } = input
      const { user } = ctx.session

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const challenge = await getChallengeByChallengeId({
        db: this.trpc.database,
        entityId,
        challengeId,
      }).catch((err) => {
        metrics.fetchChallengeErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            challengeId,
          },
          'error fetching challenge',
        )
        throw Trpc.handleStatus(500, 'error fetching challenge')
      })

      if (!challenge || challenge?.state === ChallengeState.EXPIRED) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'CHALLENGE_DOES_NOT_EXIST',
          }),
        )
      }

      const publicClient = supportedChainsPublicClientsMap[challenge.chainId]

      if (!publicClient) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'UNSUPPORTED_CHAIN_ID',
          }),
        )
      }

      const result = await publicClient.verifyMessage({
        address: challenge.address,
        message: generateChallenge(challenge.address),
        signature,
      })

      if (!result) {
        throw Trpc.handleStatus(
          400,
          new DappConsoleError({
            code: 'CHALLENGE_FAILED',
          }),
        )
      }

      await this.trpc.database
        .transaction(async (tx) => {
          await completeChallenge({
            db: tx,
            entityId,
            challengeId,
          })
          await verifyContract({
            db: tx,
            entityId,
            contractId: challenge.contractId,
          })
        })
        .catch((err) => {
          metrics.completeChallengeErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId,
              challengeId,
            },
            'error updating challenge to complete',
          )
          throw Trpc.handleStatus(
            500,
            'server failed to mark challenge as complete',
          )
        })

      return { success: true }
    })

  public readonly getContract = 'getContract' as const
  public readonly getContractController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        contractId: this.z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { contractId } = input
      const { user } = ctx.session

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
            contractId,
          },
          'error fetching contract',
        )
        throw Trpc.handleStatus(500, 'error fetching contract')
      })

      if (!contract) {
        throw Trpc.handleStatus(400, 'contract does not exist')
      }

      return addRebateEligibilityToContract(contract)
    })

  public readonly deleteContractRoute = 'deleteContract' as const
  public readonly deleteContractController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        contractId: this.z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { contractId } = input
      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      await deleteContract({
        db: this.trpc.database,
        contractId,
        entityId,
      }).catch((err) => {
        metrics.deleteContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
            contractId,
          },
          'error deleting contract',
        )
        throw Trpc.handleStatus(500, 'error deleting contract')
      })

      return { success: true }
    })

  public readonly handler = this.trpc.router({
    [this.listContractsForApp]: this.listContractsForAppController,
    [this.createContract]: this.createContractController,
    [this.startVerification]: this.startVerificationController,
    [this.completeVerification]: this.completeVerificationController,
    [this.deleteContractRoute]: this.deleteContractController,
  })
}
