import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { RiExternalLinkLine } from '@remixicon/react'

import { LocalAccountSigner, createBundlerClient } from '@alchemy/aa-core'
import { encodeFunctionData, http } from 'viem'

import { createMultiOwnerModularAccountClient } from '@alchemy/aa-accounts'
import { optimismSepolia } from 'viem/chains'
import { useQuery } from '@tanstack/react-query'
import { superchainPaymasterMiddleware } from '@/middleware/superchainPaymasterMiddleware'
import { SimpleNftAbi } from '@/abis/SimpleNftAbi'

const simpleNftAddress = '0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6'

const signer = LocalAccountSigner.mnemonicToAccountSigner(
  'test test test test test test test test test test test junk',
)
const chain = optimismSepolia

const bundlerRpcTransport = http(
  import.meta.env.VITE_BUNDLER_RPC_URL_OP_SEPOLIA as string,
)

const paymasterClient = createBundlerClient({
  transport: http('https://dev-paymaster.optimism.io/v1/11155420/rpc'),
  chain,
})

// const RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'
// const BUNDLER_RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'
// const PAYMASTER_RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'

// const chain = sepolia

// const signer = LocalAccountSigner.mnemonicToAccountSigner('YOUR_OWNER_MNEMONIC')

// const client = createSmartAccountClient({
//   chain,
//   transport: (opts) => {
//     const bundlerRpc = http(BUNDLER_RPC_URL)(opts)
//     const publicRpc = http(RPC_URL)(opts)

//     return custom({
//       request: async (args) => {
//         const bundlerMethods = new Set([
//           'eth_sendUserOperation',
//           'eth_estimateUserOperationGas',
//           'eth_getUserOperationReceipt',
//           'eth_getUserOperationByHash',
//           'eth_supportedEntryPoints',
//         ])

//         if (bundlerMethods.has(args.method)) {
//           return bundlerRpc.request(args)
//         } else {
//           return publicRpc.request(args)
//         }
//       },
//     })(opts)
//   },

//   paymasterAndData: {
//     paymasterAndData: async (userop, opts) => {
//       // call your paymaster here to sponsor the userop
//       // leverage the `opts` field to apply any overrides

//       return {
//         ...userop,
//         paymasterAndData: '0xresponsefromprovider',
//       }
//     },
//     dummyPaymasterAndData: () => '0xnonrevertingpaymasterandata',
//   },
// })

const useModularAccountClient = () => {
  return useQuery({
    queryKey: ['modular-account-client'],
    queryFn: () => {
      return createMultiOwnerModularAccountClient({
        transport: bundlerRpcTransport,
        chain,
        account: { signer },
        ...superchainPaymasterMiddleware(paymasterClient),
      })
    },
    staleTime: Infinity,
  })
}

export const MainPage = () => {
  const { data: modularAccountClient } = useModularAccountClient()
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>superchain paymaster + aa-sdk</CardTitle>
          <CardDescription>
            Mint an NFT using a{' '}
            <a
              href="https://github.com/alchemyplatform/modular-account"
              className="inline-flex items-center gap-1"
            >
              Modular Account
              <RiExternalLinkLine className="h-[1rem] w-[1rem]" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={async () => {
              console.log('account address', modularAccountClient?.getAddress())
              console.log(
                'account entry point',
                modularAccountClient?.account.getEntryPoint(),
              )

              console.log('minting NFT')

              if (!modularAccountClient) {
                return
              }

              const uoCallData = encodeFunctionData({
                abi: SimpleNftAbi,
                functionName: 'mintTo',
                args: [modularAccountClient.getAddress()],
              })

              const uo = await modularAccountClient.sendUserOperation({
                uo: {
                  target: simpleNftAddress,
                  data: uoCallData,
                },
              })

              const txHash =
                await modularAccountClient.waitForUserOperationTransaction(uo)

              console.log('minted NFT', txHash)
            }}
          >
            Mint
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
