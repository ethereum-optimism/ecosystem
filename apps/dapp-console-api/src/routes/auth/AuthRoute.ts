import { zodEthereumAddress } from '@/api'
import { envVars } from '@/constants'
import { updatePrivyCreatedAt } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { verifyPrivyAuthAndCreateUserSession } from '@/utils'
import { getCoinbaseVerificationAttestationFromEAS } from '@/utils/coinbaseVerification'
import { getGitcoinPassportAttestation } from '@/utils/getGitcoinPassportAttestation'
import { getTempFaucetAccessAttestation } from '@/utils/getTempFaucetAccessAttestation'
import { verifyWorldIdUser } from '@/utils/verifyWorldIdUser'

import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class AuthRoute extends Route {
  public readonly name = 'auth' as const

  public readonly loginUser = 'loginUser' as const
  public readonly loginUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      await verifyPrivyAuthAndCreateUserSession(this.trpc, ctx)

      const { session } = ctx

      const entity = await assertUserAuthenticated(
        this.trpc.database,
        session.user,
      )

      if (!entity.privyCreatedAt) {
        const privyUser = await this.trpc.privy
          .getUser(entity.privyDid)
          .catch((err) => {
            metrics.fetchPrivyUserErrorCount.inc()
            this.logger?.error(
              {
                error: err,
                entityId: entity.id,
                privyDid: entity.privyDid,
              },
              'error fetching privy user',
            )
            throw Trpc.handleStatus(500, 'error fetching privy user')
          })

        await updatePrivyCreatedAt({
          db: this.trpc.database,
          entityId: entity.id,
          privyCreatedAt: privyUser.createdAt,
        }).catch((err) => {
          metrics.updatePrivyCreatedAtErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: entity.id,
              privyDid: entity.privyDid,
            },
            'error updating privy created at on entity',
          )
          throw Trpc.handleStatus(500, 'error updating entity')
        })
      }

      return { entity }
    },
  )

  public readonly logoutUser = 'logoutUser' as const
  public readonly logoutUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      const { session } = ctx

      delete session.user

      await session.save().catch((err) => {
        metrics.logoutUserErrorCount.inc()
        this.logger?.error({ err }, 'failed to logout user')
        throw Trpc.handleStatus(500, 'unable to logout user')
      })

      return { success: true }
    },
  )

  public readonly isAttested = 'isAttested' as const
  public readonly isAttestedController = this.trpc.procedure
    .input(
      this.z
        .object({
          address: zodEthereumAddress,
        })
        .describe('returns whether the address is attested for in any way'),
    )
    .query(async (req) => {
      // Checks if user is Gitcoin Passport attested with a score > 25
      const gitcoinPassportAttestation = await getGitcoinPassportAttestation(
        req.input.address,
      )
      if (
        gitcoinPassportAttestation &&
        gitcoinPassportAttestation.score.profileScore > 25
      ) {
        return true
      }

      // Checks if user is attested for Optimism Faucet access by an allowlisted attester
      const attestersArray = envVars.FAUCET_ACCESS_ATTESTERS

      if (!attestersArray || attestersArray.length === 0) {
        return false
      }

      const tempFaucetAttestation = await getTempFaucetAccessAttestation(
        req.input.address,
        attestersArray,
      )

      if (tempFaucetAttestation) {
        return true
      }

      const coinbaseVerificationAttestation =
        await getCoinbaseVerificationAttestationFromEAS(req.input.address)

      if (coinbaseVerificationAttestation) {
        return true
      }

      return false
    })

  public readonly isCoinbaseVerified = 'isCoinbaseVerified' as const
  public readonly isCoinbaseVerifiedController = this.trpc.procedure
    .input(
      this.z
        .object({
          address: zodEthereumAddress,
        })
        .describe('returns whether the address is attested for in any way'),
    )
    .query(async (req) => {
      const coinbaseVerificationAttestation =
        await getCoinbaseVerificationAttestationFromEAS(req.input.address)

      if (coinbaseVerificationAttestation) {
        return true
      }

      return false
    })

  public readonly isWorldIdUser = 'isWorldIdUser' as const
  public readonly isWorldIdUserController = this.trpc.procedure.query(
    ({ ctx }) => {
      const { session } = ctx
      const worldIdUser = session.worldIdUser

      if (!worldIdUser?.isVerified) {
        return false
      }

      return true
    },
  )

  public readonly worldIdVerify = 'worldIdVerify' as const
  public readonly worldIdVerifyLoginController = this.trpc.procedure
    .input(
      this.z.object({
        merkle_root: this.z
          .string()
          .describe('Merkle root of the WorldID credential'),
        nullifier_hash: this.z
          .string()
          .describe('Nullifier hash of the WorldID credential'),
        proof: this.z.string().describe('Proof of the WorldID credential'),
        verification_level: this.z
          .string()
          .describe('Type of the WorldID credential'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx
      const merkle_root = input.merkle_root
      const nullifier_hash = input.nullifier_hash
      const proof = input.proof
      const verification_level = input.verification_level
      const action = envVars.WORLDID_APP_ACTION_NAME

      if (verification_level !== 'orb') {
        throw Trpc.handleStatus(400, 'Invalid WorldId Credential Type')
      }

      let isVerified: boolean
      try {
        isVerified = await verifyWorldIdUser({
          merkle_root,
          nullifier_hash,
          proof,
          verification_level,
          action,
        })
      } catch (err) {
        console.error('Error verifying worldId User', err)
        metrics.worldIdVerifyUserFailures.inc()
        throw Trpc.handleStatus(500)
      }

      if (!isVerified) {
        throw Trpc.handleStatus(400, 'Invalid WorldId Proof')
      }

      session.worldIdUser = {
        nullifierHash: nullifier_hash,
        isVerified: true,
        createdAt: new Date().toUTCString(),
      }

      await session.save()

      return session.worldIdUser
    })

  public readonly logoutWorldIdUser = 'logoutWorldIdUser' as const
  public readonly logoutWorldIdUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      const { session } = ctx
      // For some reason iron session does not let you set this to undefined.
      session.worldIdUser = {} as any

      await session.save()

      return { success: true }
    },
  )

  public readonly handler = this.trpc.router({
    [this.logoutUser]: this.logoutUserController,
    [this.loginUser]: this.loginUserController,
    [this.isAttested]: this.isAttestedController,
    [this.isCoinbaseVerified]: this.isCoinbaseVerifiedController,
    [this.worldIdVerify]: this.worldIdVerifyLoginController,
    [this.isWorldIdUser]: this.isWorldIdUserController,
    [this.logoutWorldIdUser]: this.logoutWorldIdUserController,
  })
}
