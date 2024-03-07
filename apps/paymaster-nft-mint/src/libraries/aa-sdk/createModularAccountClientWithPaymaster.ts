import { SmartAccountSigner } from '@alchemy/aa-core'

import { createMultiOwnerModularAccountClient } from '@alchemy/aa-accounts'
import { sepolia } from 'viem/chains'
import { superchainPaymasterMiddleware } from '@/libraries/aa-sdk/superchainPaymasterMiddleware'
import { Chain, http } from 'viem'

export const createModularAccountClientWithPaymaster = ({
  signer,
  paymasterRpcUrl,
  bundlerRpcUrl,
  chain,
}: {
  signer: SmartAccountSigner
  paymasterRpcUrl: string
  bundlerRpcUrl: string
  chain: Chain
}) => {
  return createMultiOwnerModularAccountClient({
    transport: http(bundlerRpcUrl),
    chain,
    account: { signer },
    ...superchainPaymasterMiddleware({
      paymasterRpcUrl,
      chain: sepolia,
    }),
  })
}

export type ModularAccountClientWithPaymaster = Awaited<
  ReturnType<typeof createModularAccountClientWithPaymaster>
>
