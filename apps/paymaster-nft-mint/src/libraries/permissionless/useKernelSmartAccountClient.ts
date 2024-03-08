import { config } from '@/config'
import { useChainRpcConfig } from '@/hooks/useChainRpcConfig'
import { useLocallyStoredPrivateKey } from '@/hooks/useLocallyStoredPrivateKey'
import { useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from 'permissionless'

import { signerToEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico'
import { Chain, LocalAccount, PublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const createKernelSmartAccountClient = async <T extends string = 'custom'>({
  signer,
  paymasterRpcUrl,
  bundlerRpcUrl,
  entrypointAddress,
  chain,
}: {
  signer: LocalAccount<T>
  paymasterRpcUrl: string
  bundlerRpcUrl: string
  entrypointAddress: typeof ENTRYPOINT_ADDRESS_V06
  chain: Chain
}) => {
  const publicClient = getPublicClient(config, {
    // @ts-expect-error TODO: restrict Chain type to only allow configured ones
    chainId: chain.id,
  })

  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(paymasterRpcUrl),
    entryPoint: entrypointAddress,
  })

  const kernelAccount = await signerToEcdsaKernelSmartAccount(
    publicClient as PublicClient,
    {
      entryPoint: entrypointAddress,
      signer: signer,
    },
  )

  const smartAccountClient = createSmartAccountClient({
    account: kernelAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chain,
    bundlerTransport: http(bundlerRpcUrl),
    middleware: {
      sponsorUserOperation: paymasterClient.sponsorUserOperation,
    },
  })

  return smartAccountClient
}

export type KernelSmartAccountWithLocalAccountSigner = Awaited<
  ReturnType<typeof createKernelSmartAccountClient>
>

export const useKernelSmartAccountClient = <T extends string = 'custom'>({
  signer,
  paymasterRpcUrl,
  bundlerRpcUrl,
  chain,
}: {
  signer: LocalAccount<T>
  paymasterRpcUrl: string
  bundlerRpcUrl: string
  chain: Chain
}) => {
  return useQuery({
    queryKey: [
      'kernel-client',
      paymasterRpcUrl,
      bundlerRpcUrl,
      chain.id,
      signer.address,
    ],
    // TODO: Further namespace this by signer account
    queryFn: () =>
      createKernelSmartAccountClient({
        signer,
        paymasterRpcUrl,
        bundlerRpcUrl,
        chain,
        entrypointAddress: ENTRYPOINT_ADDRESS_V06,
      }),
    staleTime: Infinity,
  })
}

export const useDefaultKernelSmartAccountClient = () => {
  const privateKey = useLocallyStoredPrivateKey()

  const { chain, paymasterRpcUrl, bundlerRpcUrl } = useChainRpcConfig()

  return useKernelSmartAccountClient({
    signer: privateKeyToAccount(privateKey),
    paymasterRpcUrl,
    bundlerRpcUrl,
    chain,
  })
}
