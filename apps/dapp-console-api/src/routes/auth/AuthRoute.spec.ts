import type { RouterCaller } from '@trpc/server'
import type { getIronSession } from 'iron-session'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionData } from '@/constants'
import { envVars } from '@/constants'
import {
  createSignedInCaller,
  mockDB,
  mockLogger,
  mockPrivyClient,
  validSession,
} from '@/testhelpers'
import type { WorldIdSessionType } from '@/testhelpers/auth'
import { Trpc } from '@/Trpc'
import * as verifyWorldIdUserModule from '@/utils/verifyWorldIdUser'

import { AuthRoute } from './AuthRoute'

describe(AuthRoute.name, () => {
  let trpc: Trpc
  let caller: ReturnType<RouterCaller<AuthRoute['handler']['_def']>>
  let session: Awaited<ReturnType<typeof getIronSession<SessionData>>>

  beforeEach(async () => {
    session = await validSession({
      nullifierHash: 'nullifierHash',
      isVerified: true,
      createdAt: Date.now().toString(),
    } as WorldIdSessionType)
    const privyClient = mockPrivyClient()

    trpc = new Trpc(privyClient, mockLogger, mockDB)
    const route = new AuthRoute(trpc).handler
    caller = createSignedInCaller(route, session)
  })

  it('logoutUser deletes the users session', async () => {
    expect(session.user).toBeDefined()

    await caller.logoutUser()

    expect(session.user).toBeUndefined()
  })

  it('returns true if worldIdUser isVerified', async () => {
    const result = await caller.isWorldIdUser()

    expect(result).toBe(true)
  })

  describe('worldIdVerify', () => {
    it('verifies WorldID successfully', async () => {
      vi.spyOn(verifyWorldIdUserModule, 'verifyWorldIdUser').mockImplementation(
        () => Promise.resolve(true),
      )

      const input = {
        merkle_root: 'test_merkle_root',
        nullifier_hash: 'test_nullifier_hash',
        proof: 'test_proof',
        verification_level: 'orb',
      }

      const response = await caller.worldIdVerify(input)

      expect(verifyWorldIdUserModule.verifyWorldIdUser).toHaveBeenCalledWith({
        merkle_root: input.merkle_root,
        nullifier_hash: input.nullifier_hash,
        proof: input.proof,
        verification_level: input.verification_level,
        action: envVars.WORLDID_APP_ACTION_NAME,
      })
      expect(response.isVerified).toBe(true)
    })

    it('handles verification failure', async () => {
      vi.spyOn(verifyWorldIdUserModule, 'verifyWorldIdUser').mockImplementation(
        () => Promise.resolve(false),
      )
      const input = {
        merkle_root: 'test_merkle_root',
        nullifier_hash: 'test_nullifier_hash',
        proof: 'test_proof',
        verification_level: 'test_verification_level',
      }

      expect(caller.worldIdVerify(input)).rejects.toHaveProperty(
        'code',
        'BAD_REQUEST',
      )

      expect(caller.worldIdVerify(input)).rejects.toHaveProperty(
        'message',
        'Bad request',
      )
    })
  })
})
