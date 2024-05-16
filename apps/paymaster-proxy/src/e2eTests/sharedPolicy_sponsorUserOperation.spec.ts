import {
  deepHexlify,
  ENTRYPOINT_ADDRESS_V06,
  ENTRYPOINT_ADDRESS_V07,
} from 'permissionless/utils'
import supertest from 'supertest'
import { parseGwei, toHex } from 'viem'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { e2eEnvVars } from '@/e2eTests/e2eEnvVars'
import {
  getMintUserOperationWithRandomSimpleAccount,
  getRevertingUserOperationWithRandomSimpleAccount,
} from '@/testUtils/simpleAccount/exampleSimpleAccountUserOperations'
import { successfulPaymasterResultMatcher } from '@/testUtils/successfulPaymasterResultMatcher'

const app = supertest(e2eEnvVars.E2E_TEST_BASE_URL)

describe('pm_sponsorUserOperation', async () => {
  describe.each([
    zoraSepolia,
    optimismSepolia,
    baseSepolia,
    fraxtalSepolia,
    sepolia,
  ])('$name', async (chain) => {
    it.concurrent('happy path', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [userOperation, ENTRYPOINT_ADDRESS_V06],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        result: successfulPaymasterResultMatcher,
      })
    })

    it.concurrent('happy path batched', async () => {
      const userOperation1 =
        await getMintUserOperationWithRandomSimpleAccount(chain)
      const userOperation2 =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send([
          {
            jsonrpc: '2.0',
            id: 1,
            method: 'pm_sponsorUserOperation',
            params: [userOperation1, ENTRYPOINT_ADDRESS_V06],
          },
          {
            jsonrpc: '2.0',
            id: 2,
            method: 'pm_sponsorUserOperation',
            params: [userOperation2, ENTRYPOINT_ADDRESS_V06],
          },
        ])
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject([
        {
          jsonrpc: '2.0',
          id: 1,
          result: successfulPaymasterResultMatcher,
        },
        {
          jsonrpc: '2.0',
          id: 2,
          result: successfulPaymasterResultMatcher,
        },
      ])
    })

    it.concurrent('respects fee params', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [
            deepHexlify({
              ...userOperation,
              maxFeePerGas: parseGwei('420'),
              maxPriorityFeePerGas: parseGwei('300'),
            }),
            ENTRYPOINT_ADDRESS_V06,
          ],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        result: {
          ...successfulPaymasterResultMatcher,
          maxFeePerGas: toHex(parseGwei('420')),
          maxPriorityFeePerGas: toHex(parseGwei('300')),
        },
      })
    })

    it.concurrent('rejects unsupported methods', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_unsupportedMethod',
          params: [userOperation, ENTRYPOINT_ADDRESS_V06],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32601,
          message: expect.stringContaining('Method not found'),
        },
      })
    })

    it.concurrent('ignores gas estimation params', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [
            deepHexlify({
              ...userOperation,
              callGasLimit: toHex(parseGwei('42000')),
              verificationGasLimit: toHex(parseGwei('42000')),
              preVerificationGas: toHex(parseGwei('42000')),
            }),
            ENTRYPOINT_ADDRESS_V06,
          ],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        result: successfulPaymasterResultMatcher,
      })

      expect(result.body.result).not.toMatchObject({
        callGasLimit: toHex(parseGwei('42000')),
        verificationGasLimit: toHex(parseGwei('42000')),
        preVerificationGas: toHex(parseGwei('42000')),
      })
    })

    it.concurrent('rejects incomplete userOperation', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const { nonce, sender, callData } = userOperation
      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [{ nonce, sender, callData }, ENTRYPOINT_ADDRESS_V06],
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
        },
      })
    })

    it.concurrent('rejects incorrect signatures', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [
            { ...userOperation, signature: '0x1221' },
            ENTRYPOINT_ADDRESS_V06,
          ],
        })
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32500,
          message: expect.stringContaining('invalid signature length'),
        },
      })
    })

    it.concurrent('rejects reverting transaction', async () => {
      const userOperation =
        await getRevertingUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [userOperation, ENTRYPOINT_ADDRESS_V06],
        })
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32521,
          message: expect.stringContaining('execution reverted'),
        },
      })
    })

    it.concurrent('rejects if entrypoint not specified', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [userOperation],
        })
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
          message: expect.stringContaining('Validation error'),
        },
      })
    })

    it.concurrent('rejects if entrypoint is not supported', async () => {
      const userOperation =
        await getMintUserOperationWithRandomSimpleAccount(chain)

      const result = await app
        .post(`/v1/${chain.id}/rpc`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [userOperation, ENTRYPOINT_ADDRESS_V07],
        })
        .expect(200)

      expect(result.body).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
          message: expect.stringContaining('Validation error'),
        },
      })
    })
  })
})
