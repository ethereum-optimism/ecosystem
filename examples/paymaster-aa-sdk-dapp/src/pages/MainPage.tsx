import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { RiExternalLinkLine } from '@remixicon/react'

import {
  LocalAccountSigner,
  SmartAccountSigner,
  createSmartAccountClient,
  sepolia,
} from '@alchemy/aa-core'
import { custom, http } from 'viem'

const RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'
const BUNDLER_RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'
const PAYMASTER_RPC_URL = 'https://rpc.alchemyapi.io/v2/YOUR'

const chain = sepolia

const signer = LocalAccountSigner.mnemonicToAccountSigner('YOUR_OWNER_MNEMONIC')

const client = createSmartAccountClient({
  chain,
  transport: (opts) => {
    const bundlerRpc = http(BUNDLER_RPC_URL)(opts)
    const publicRpc = http(RPC_URL)(opts)

    return custom({
      request: async (args) => {
        const bundlerMethods = new Set([
          'eth_sendUserOperation',
          'eth_estimateUserOperationGas',
          'eth_getUserOperationReceipt',
          'eth_getUserOperationByHash',
          'eth_supportedEntryPoints',
        ])

        if (bundlerMethods.has(args.method)) {
          return bundlerRpc.request(args)
        } else {
          return publicRpc.request(args)
        }
      },
    })(opts)
  },

  paymasterAndData: {
    paymasterAndData: async (userop, opts) => {
      // call your paymaster here to sponsor the userop
      // leverage the `opts` field to apply any overrides

      return {
        ...userop,
        paymasterAndData: '0xresponsefromprovider',
      }
    },
    dummyPaymasterAndData: () => '0xnonrevertingpaymasterandata',
  },
})

export const MainPage = () => {
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
          <Button>Mint</Button>
        </CardContent>
      </Card>
    </div>
  )
}
