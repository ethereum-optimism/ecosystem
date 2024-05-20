import type { ClientWithAlchemyMethods } from '@alchemy/aa-alchemy'
import { createBundlerClient } from '@alchemy/aa-core'
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless/utils'
import { http } from 'viem'
import { sepolia } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

import { AlchemySponsorUserOperationProxiedError } from '@/paymasterProvider/alchemy/alchemyErrors'
import { alchemySponsorUserOperation } from '@/paymasterProvider/alchemy/alchemySponsorUserOperation'
import {
  mockPostError,
  mockPostErrorWithReturnJson,
  mockPostSuccessJson,
} from '@/testUtils/mswServer'

const MOCK_USER_OPERATION = {
  sender: '0x315b3be8741Cfb75279Fb75D20777B469A087467',
  nonce: '0x0',
  initCode:
    '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3296601cd0000000000000000000000000da6a956b9488ed4dd761e59f52fdc6c8068e6b5000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084d1f57894000000000000000000000000d9ab5096a832b9ce79914329daee236f8eea039000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000014F4f05B6ED874595c157249659B1cd79cd686c96e00000000000000000000000000000000000000000000000000000000000000000000000000000000',
  callData:
    '0x51945447000000000000000000000000ab559628b94fd9748658c46e58a85efb52fdaca60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024755edd17000000000000000000000000315b3be8741cfb75279fb75d20777b469a08746700000000000000000000000000000000000000000000000000000000',
  paymasterAndData: '0x',
  signature:
    '0x00000000fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
  maxFeePerGas: '0xf436f',
  maxPriorityFeePerGas: '0xf4240',
  callGasLimit: '0x0',
  verificationGasLimit: '0x0',
  preVerificationGas: '0x0',
} as const

const MOCK_POLICY_ID = 'fake-policy-id'

const MOCK_ALCHEMY_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/fake-api-key'

describe(alchemySponsorUserOperation.name, async () => {
  const alchemyClient = createBundlerClient({
    chain: sepolia,
    transport: http(MOCK_ALCHEMY_RPC_URL),
  }) as ClientWithAlchemyMethods

  const clientRequestSpy = vi.spyOn(alchemyClient, 'request')

  it('removes gas estimation params but retains fee estimation params', async () => {
    mockPostSuccessJson(MOCK_ALCHEMY_RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      result: {
        paymasterAndData: '0x',
        callGasLimit: '0x0',
        verificationGasLimit: '0x0',
        preVerificationGas: '0x0',
        maxFeePerGas: '0xf436f',
        maxPriorityFeePerGas: '0xf4240',
      },
    })

    await expect(
      alchemySponsorUserOperation(
        alchemyClient,
        MOCK_POLICY_ID,
        MOCK_USER_OPERATION,
        ENTRYPOINT_ADDRESS_V06,
      ),
    )

    expect(clientRequestSpy).toHaveBeenCalledWith({
      method: 'alchemy_requestGasAndPaymasterAndData',
      params: [
        {
          policyId: MOCK_POLICY_ID,
          entryPoint: ENTRYPOINT_ADDRESS_V06,
          userOperation: {
            sender: '0x315b3be8741Cfb75279Fb75D20777B469A087467',
            nonce: '0x0',
            initCode:
              '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3296601cd0000000000000000000000000da6a956b9488ed4dd761e59f52fdc6c8068e6b5000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084d1f57894000000000000000000000000d9ab5096a832b9ce79914329daee236f8eea039000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000014F4f05B6ED874595c157249659B1cd79cd686c96e00000000000000000000000000000000000000000000000000000000000000000000000000000000',
            callData:
              '0x51945447000000000000000000000000ab559628b94fd9748658c46e58a85efb52fdaca60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024755edd17000000000000000000000000315b3be8741cfb75279fb75d20777b469a08746700000000000000000000000000000000000000000000000000000000',
          },
          dummySignature:
            '0x00000000fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
          overrides: {
            maxFeePerGas: '0xf436f',
            maxPriorityFeePerGas: '0xf4240',
          },
        },
      ],
    })
  })

  it('throws AlchemySponsorUserOperationProxiedError when Alchemy paymaster returns a 400', async () => {
    mockPostErrorWithReturnJson(MOCK_ALCHEMY_RPC_URL, 400, {
      jsonrpc: '2.0',
      id: 1,
      code: -32521,
      error: { code: -32521, message: 'execution reverted' },
    })

    await expect(
      alchemySponsorUserOperation(
        alchemyClient,
        MOCK_POLICY_ID,
        MOCK_USER_OPERATION,
        ENTRYPOINT_ADDRESS_V06,
      ),
    ).rejects.toThrowError(AlchemySponsorUserOperationProxiedError)
  })

  it('throws non-AlchemySponsorUserOperationProxiedError when unexpected error is thrown', async () => {
    clientRequestSpy.mockImplementationOnce(async () => {
      throw new Error('test')
    })

    await expect(
      alchemySponsorUserOperation(
        alchemyClient,
        MOCK_POLICY_ID,
        MOCK_USER_OPERATION,
        ENTRYPOINT_ADDRESS_V06,
      ),
    ).rejects.toThrowError(Error)
  })

  it('throws non-AlchemySponsorUserOperationProxiedError when Alchemy doesnt return json rpc response', async () => {
    mockPostError(MOCK_ALCHEMY_RPC_URL, 400)

    await expect(
      alchemySponsorUserOperation(
        alchemyClient,
        MOCK_POLICY_ID,
        MOCK_USER_OPERATION,
        ENTRYPOINT_ADDRESS_V06,
      ),
    ).rejects.toThrowError(ZodError)
  })
})
