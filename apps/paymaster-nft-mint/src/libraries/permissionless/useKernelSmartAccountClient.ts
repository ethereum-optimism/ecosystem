import { useChainRpcConfig } from '@/hooks/useChainRpcConfig'
import { useLocallyStoredPrivateKey } from '@/hooks/useLocallyStoredPrivateKey'
import { useQuery } from '@tanstack/react-query'
import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from 'permissionless'

import { signerToEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico'
import { Chain, LocalAccount, createPublicClient, http } from 'viem'
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
  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(paymasterRpcUrl),
    // transport: http(
    //   'https://api.pimlico.io/v2/optimism-sepolia/rpc?apikey=ae917ace-332b-47b3-af17-0535c4cce641',
    // ),
    entryPoint: entrypointAddress,
  })

  const kernelAccount = await signerToEcdsaKernelSmartAccount(
    createPublicClient({
      transport: http(chain.rpcUrls.default.http[0]),
      chain,
    }),
    {
      entryPoint: entrypointAddress, // global entrypoint
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
      // sponsorUserOperation: async (args) => {
      //   // const { userOperation } = args

      //   const {
      //     callGasLimit: k,
      //     verificationGasLimit: a,
      //     preVerificationGas: z,
      //     ...userOpWithoutUnnecessary
      //   } = args.userOperation
      //   const result = await paymasterClient.sponsorUserOperation({
      //     ...args,
      //     userOperation: userOpWithoutUnnecessary,
      //   })

      //   const {
      //     callGasLimit,
      //     verificationGasLimit,
      //     preVerificationGas,
      //     paymasterAndData,
      //   } = result

      //   console.log('paymasterAndData', paymasterAndData)

      //   return {
      //     callGasLimit,
      //     verificationGasLimit,
      //     preVerificationGas,
      //     paymasterAndData,
      //   }
      // },
    },
  })

  // console.log(smartAccountClient.chain)

  // console.log(
  //   'bytecode',
  //   await getBytecode(smartAccountClient, {
  //     address: smartAccountClient.account.address,
  //   }),
  // )

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
