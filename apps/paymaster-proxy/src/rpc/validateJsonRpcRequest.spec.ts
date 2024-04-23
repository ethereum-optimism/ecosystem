import { describe, expect, it } from 'vitest'

import {
  invalidParamsErrorCode,
  invalidRequestErrorCode,
  methodNotFoundErrorCode,
} from '@/errors/JsonRpcError'
import { validateJsonRpcRequest } from '@/rpc/validateJsonRpcRequest'
import type { UserOperation } from '@/schemas/userOperationSchema'

const entrypoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

const testUserOp = {
  callGasLimit: '0x0',
  verificationGasLimit: '0x0',
  preVerificationGas: '0x0',
  maxFeePerGas: '0x0',
  maxPriorityFeePerGas: '0x0',
  paymasterAndData: '0x',
  signature: '0x',
  sender: '0xceb161d3e0B6d01bc0e87ECC27fF9f2E2eCDCD81',
  nonce: '0x3',
  initCode: '0x',
  callData:
    '0xb61d27f600000000000000000000000043f6bfbe9dad44cf0a60570c30c307d949be4cd40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000645c833bfd000000000000000000000000613c64104b98b048b93289ed20aefd80912b3cde0000000000000000000000000000000000000000000000000de123e8a84f9901000000000000000000000000c9371ea30dea5ac745b71e191ba8cde2c4e66df500000000000000000000000000000000000000000000000000000000',
} satisfies UserOperation

describe('validateJsonRpcRequest', () => {
  it('passing invalid input (array) results in InvalidRequest Error', async () => {
    const result = await validateJsonRpcRequest([])

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.errorCode).toEqual(invalidRequestErrorCode)
  })
  it('passing invalid method results in InvalidRequest Error', async () => {
    const result = await validateJsonRpcRequest({
      jsonrpc: '2.0',
      method: 'unknown_method',
      params: [],
      id: 1,
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.errorCode).toEqual(methodNotFoundErrorCode)
  })

  it('passing correct pm_sponsorUserOperation with correct params passes', async () => {
    const result = await validateJsonRpcRequest({
      jsonrpc: '2.0',
      method: 'pm_sponsorUserOperation',
      params: [testUserOp, entrypoint],
      id: 1,
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('passing correct pm_sponsorUserOperation with incorrect params throws InvalidParams Error', async () => {
    const result = await validateJsonRpcRequest({
      jsonrpc: '2.0',
      method: 'pm_sponsorUserOperation',
      params: [testUserOp],
      id: 1,
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.errorCode).toEqual(invalidParamsErrorCode)
  })

  it('passing correct pm_sponsorUserOperation with invalid userop throws InvalidParams Error', async () => {
    const result = await validateJsonRpcRequest({
      jsonrpc: '2.0',
      method: 'pm_sponsorUserOperation',
      params: [{ ...testUserOp, sender: 'something_wrong' }, entrypoint],
      id: 1,
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.error?.errorCode).toEqual(invalidParamsErrorCode)
  })
})
