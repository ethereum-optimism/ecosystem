import { useChainRpcConfig } from '@/hooks/useChainRpcConfig'
import { useLocallyStoredPrivateKey } from '@/hooks/useLocallyStoredPrivateKey'
import { createModularAccountClientWithPaymaster } from '@/libraries/aa-sdk/createModularAccountClientWithPaymaster'
import { LocalAccountSigner, SmartAccountSigner } from '@alchemy/aa-core'

import { useQuery } from '@tanstack/react-query'
import { Chain } from 'viem'

export const useModularAccountClientWithPaymaster = ({
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
  return useQuery({
    queryKey: [
      'modular-account-client',
      paymasterRpcUrl,
      bundlerRpcUrl,
      chain.id,
    ],
    // TODO: Further namespace this by signer account
    queryFn: () =>
      createModularAccountClientWithPaymaster({
        signer,
        rpcUrl,
        paymasterRpcUrl,
        bundlerRpcUrl,
        chain,
      }),
    staleTime: Infinity,
  })
}

// For current chain and locally stored private key
export const useDefaultModularAccountClientWithPaymaster = () => {
  const privateKey = useLocallyStoredPrivateKey()

  const { chain, rpcUrl, paymasterRpcUrl, bundlerRpcUrl } = useChainRpcConfig()

  return useModularAccountClientWithPaymaster({
    signer: LocalAccountSigner.privateKeyToAccountSigner(privateKey),
    rpcUrl,
    paymasterRpcUrl,
    bundlerRpcUrl,
    chain,
  })
}
