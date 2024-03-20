import {
  SmartAccountSigner,
  UserOperationRequest,
  createSmartAccountClient,
  deepHexlify,
  getVersion060EntryPoint,
  resolveProperties,
} from '@alchemy/aa-core'

import { createMultiOwnerModularAccount } from '@alchemy/aa-accounts'
import { Chain, custom, http } from 'viem'
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
    factoryAddress: '0x000000e92D78D90000007F0082006FDA09BD5f11',
    entryPoint: getVersion060EntryPoint(
      chain,
      '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    ),
  })

  return createSmartAccountClient({
    // Splits Bundler RPC and Public RPC traffic
    // https://accountkit.alchemy.com/third-party/bundlers.html#splitting-bundler-traffic-and-node-rpc-traffic
    transport: (opts) => {
      const bundlerRpc = http(bundlerRpcUrl)(opts)
      const publicRpc = http(rpcUrl)(opts)

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
