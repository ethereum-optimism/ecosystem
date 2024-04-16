import {
  zodEthereumAddress,
  zodEthereumSignature,
  zodEthereumTransactionHash,
  zodSupportedChainId,
} from '@/api'
import { supportedChainsPublicClientsMap } from '@/constants'
import { isPrivyAuthed } from '@/middleware'
import {
  ChallengeState,
  completeChallenge,
  ContractState,
  getChallengeByChallengeId,
  getContract,
  getContractsForApp,
  getUnexpiredChallenge,
  insertChallenge,
  insertContract,
  verifyContract,
} from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { generateChallenge } from '@/utils'

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
      try {
        const { user } = ctx.session

        assertUserAuthenticated(user)

        const contracts = await getContractsForApp({
          db: this.trpc.database,
          entityId: user.entityId,
          appId: input.appId,
        })

        return contracts
      } catch (err) {
        metrics.listContractsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error fetching contracts from db',
        )
        throw Trpc.handleStatus(500, 'error fetching contracts')
      }
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
      const {
        deployerAddress,
        contractAddress,
        deploymentTxHash,
        chainId,
        appId,
      } = input

      assertUserAuthenticated(user)

      const publicClient = supportedChainsPublicClientsMap[chainId]

      if (!publicClient) {
        throw Trpc.handleStatus(400, 'chain not supported')
      }

      const deploymentTx = await publicClient
        .getTransactionReceipt({
          hash: deploymentTxHash,
        })
        .catch((err) => {
          metrics.fetchingTxErrorCount.inc({ chainId })
          this.logger?.error(
            {
              error: err,
              entityId: user.entityId,
              txHash: deploymentTxHash,
              chainId,
            },
            'error fetching tx',
          )
          throw Trpc.handleStatus(400, 'error fetching deployment transaction')
        })

      if (deploymentTx.from !== deployerAddress) {
        throw Trpc.handleStatus(
          400,
          'deployer address does not match deployment transaction',
        )
      }

      if (deploymentTx.contractAddress !== contractAddress) {
        throw Trpc.handleStatus(
          400,
          'contract was not created by deployment transaction',
        )
      }

      const result = await insertContract({
        db: this.trpc.database,
        contract: {
          contractAddress,
          deploymentTxHash,
          deployerAddress,
          chainId,
          appId,
          state: ContractState.NOT_VERIFIED,
          entityId: user.entityId,
        },
      }).catch((err) => {
        metrics.insertContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
            contractAddress,
            chainId,
          },
          'error inserting new contract',
        )
        throw Trpc.handleStatus(500, 'error creating contract')
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

      assertUserAuthenticated(user)

      const contract = await getContract({
        db: this.trpc.database,
        contractId,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
            contractId,
          },
          'error fetching contract',
        )
        throw Trpc.handleStatus(500, 'error fetching contract')
      })

      if (!contract) {
        throw Trpc.handleStatus(400, 'contract does not exist')
      }

      if (contract.state === ContractState.VERIFIED) {
        throw Trpc.handleStatus(400, 'contract is already verified')
      }

      const challenge = await getUnexpiredChallenge({
        db: this.trpc.database,
        entityId: user.entityId,
        contractId,
      }).catch((err) => {
        metrics.fetchChallengeErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
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
          entityId: user.entityId,
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
            entityId: user.entityId,
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

      assertUserAuthenticated(user)

      const challenge = await getChallengeByChallengeId({
        db: this.trpc.database,
        entityId: user.entityId,
        challengeId,
      }).catch((err) => {
        metrics.fetchChallengeErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
            challengeId,
          },
          'error fetching challenge',
        )
        throw Trpc.handleStatus(500, 'error fetching challenge')
      })

      if (!challenge || challenge?.state === ChallengeState.EXPIRED) {
        throw Trpc.handleStatus(400, 'challenge does not exist or is expired')
      }

      const publicClient = supportedChainsPublicClientsMap[challenge.chainId]

      if (!publicClient) {
        throw Trpc.handleStatus(
          500,
          `challenge is on invalid chain id: ${challenge.chainId}`,
        )
      }

      const result = await publicClient.verifyMessage({
        address: challenge.address,
        message: generateChallenge(challenge.address),
        signature,
      })

      if (!result) {
        throw Trpc.handleStatus(400, 'challenge was not completed successfully')
      }

      await this.trpc.database
        .transaction(async (tx) => {
          await completeChallenge({
            db: tx,
            entityId: user.entityId,
            challengeId,
          })
          await verifyContract({
            db: tx,
            entityId: user.entityId,
            contractId: challenge.contractId,
          })
        })
        .catch((err) => {
          metrics.completeChallengeErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: user.entityId,
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

      assertUserAuthenticated(user)

      const contract = await getContract({
        db: this.trpc.database,
        contractId,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchContractErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
            contractId,
          },
          'error fetching contract',
        )
        throw Trpc.handleStatus(500, 'error fetching contract')
      })

      if (!contract) {
        throw Trpc.handleStatus(400, 'contract does not exist')
      }

      return contract
    })

  public readonly handler = this.trpc.router({
    [this.listContractsForApp]: this.listContractsForAppController,
    [this.createContract]: this.createContractController,
    [this.startVerification]: this.startVerificationController,
    [this.completeVerification]: this.completeVerificationController,
  })
}
