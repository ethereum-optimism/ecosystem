import {
  SmartAccountSigner,
  UserOperationRequest,
  createSmartAccountClient,
  deepHexlify,
  resolveProperties,
} from '@alchemy/aa-core'

import { createMultiOwnerModularAccount } from '@alchemy/aa-accounts'
import { Chain, http } from 'viem'
import { createSuperchainPaymasterClient } from '@/libraries/aa-sdk/createSuperchainPaymasterClient'

export const createModularAccountClientWithPaymaster = async ({
  signer,
  rpcUrl,
  paymasterRpcUrl,
  bundlerRpcUrl,
  chain,
}: {
  signer: SmartAccountSigner
  rpcUrl: string
  paymasterRpcUrl: string
  bundlerRpcUrl: string
  chain: Chain
}) => {
  const superchainPaymasterClient = createSuperchainPaymasterClient({
    paymasterRpcUrl,
    chain,
  })

  const modularAccount = await createMultiOwnerModularAccount({
    signer: signer,
    chain: chain,
    transport: http(rpcUrl),
  })

  return createSmartAccountClient({
    transport: http(bundlerRpcUrl),
    chain,
    account: modularAccount,
    gasEstimator: async (struct) => struct,
    feeEstimator: async (struct) => struct,
    paymasterAndData: {
      paymasterAndData: async (struct, { account }) => {
        const sponsorOperationResult =
          await superchainPaymasterClient.sponsorUserOperation(
            deepHexlify(
              await resolveProperties(struct),
            ) as UserOperationRequest,
            account.getEntryPoint().address,
          )
        return {
          ...struct,
          ...sponsorOperationResult,
        }
      },
      dummyPaymasterAndData: () => '0x',
    },
  })
}

export type ModularAccountClientWithPaymaster = Awaited<
  ReturnType<typeof createModularAccountClientWithPaymaster>
>
