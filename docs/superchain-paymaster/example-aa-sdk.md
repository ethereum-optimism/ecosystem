# Using the Superchain paymaster with aa-sdk

[aa-sdk](https://github.com/alchemyplatform/aa-sdk) is a popular ERC-4337 Typescript library built on top of [viem](https://viem.sh/), built by [Alchemy](https://www.alchemy.com/). In this example, we use [modular account](https://accountkit.alchemy.com/smart-accounts/modular-account/), a [ERC-6900](https://eips.ethereum.org/EIPS/eip-6900) smart account implementation that supports custom plugins to extend the functionality. Modular account is heavily optimized to minimize calldata usage, making it [one of the most competitive options](https://github.com/alchemyplatform/aa-benchmarks) on L2s in terms of end user cost.

## What we're building

- Using a modular account smart account, [mint an NFT](https://optimism-sepolia.blockscout.com/token/0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6) on Optimism Sepolia using the Superchain paymaster.

## Preparation

You will need

- RPC URL for the chain to use - a regular JSON-RPC provider
- Bundler RPC URL - this should support bundler RPC methods
- Paymaster RPC URL - choose the [Superchain paymaster RPC endpoint URL](./README.md) for the chain you are using

## 1. Create a paymaster client

```typescript
import { UserOperationRequest } from '@alchemy/aa-core'
import { Address, createClient, http } from 'viem'
import { optimismSepolia } from 'viem/chains'

// This one is for OP Sepolia, use a different RPC url for a different chain
const PAYMASTER_RPC_URL = 'https://paymaster.optimism.io/v1/11155420/rpc'

const superchainPaymasterClient = createClient({
  chain: optimismSepolia,
  transport: http(PAYMASTER_RPC_URL),
}).extend((client) => ({
  sponsorUserOperation: async (
    request: UserOperationRequest,
    entryPoint: Address,
  ) =>
    client.request({
      // @ts-expect-error cast the client to include the pm_sponsorUserOperation method to avoid type errors
      method: 'pm_sponsorUserOperation',
      params: [request, entryPoint],
    }),
}))
```

## 2. Create a smart account

```typescript
import { createMultiOwnerModularAccount } from '@alchemy/aa-accounts'
import { LocalAccountSigner } from '@alchemy/aa-core'
import { http } from 'viem'
import { generatePrivateKey } from 'viem/accounts'
import { optimismSepolia } from 'viem/chains'

const RPC_URL = 'https://sepolia.optimism.io/'

const smartAccountSigner =
  LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey())

const modularAccount = await createMultiOwnerModularAccount({
  signer: smartAccountSigner,
  chain: optimismSepolia,
  transport: http(RPC_URL),
})
```

## 3. Create a smart account client

We create a smart account client that connects to a bundler to be able to send and fetch user operations. We can override the gas estimation and fee estimation middleware here to save unnecessary RPC calls, since the paymaster RPC will return the estimates anyway.

```typescript
import {
  UserOperationRequest,
  createSmartAccountClient,
  deepHexlify,
  resolveProperties,
} from '@alchemy/aa-core'
import { http } from 'viem'
import { optimismSepolia } from 'viem/chains'

const BUNDLER_RPC_URL =
  'https://opt-sepolia.g.alchemy.com/v2/get-one-from-dashboard'

const smartAccountClient = createSmartAccountClient({
  transport: http(BUNDLER_RPC_URL),
  chain: optimismSepolia,
  account: modularAccount,
  gasEstimator: async (struct) => struct, // no-op since paymaster RPC will estimate gas
  feeEstimator: async (struct) => struct, // no-op since paymaster RPC will estimate fees
  paymasterAndData: {
    paymasterAndData: async (struct, { account }) => {
      const sponsorOperationResult =
        await superchainPaymasterClient.sponsorUserOperation(
          deepHexlify(await resolveProperties(struct)) as UserOperationRequest,
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
```

## 4. Send mint NFT user operation

We encode the call to the mint function on the NFT contract, and send the user operation to the bundler. the `sendUserOperation` will wait until the bundle is included, then return the transaction hash.

```typescript
import { encodeFunctionData, parseAbiItem } from 'viem'

const mintFunctionCalldata = encodeFunctionData({
  abi: [parseAbiItem('function mint() returns (uint256)')],
  functionName: 'mint',
})

const transactionHash = await smartAccountClient.sendUserOperation({
  uo: {
    target: '0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6',
    data: mintFunctionCalldata,
  },
})
```

You can see a working example dapp [here](https://superchain-paymaster-nft-mint-example.pages.dev/), and the source code [here](/apps/paymaster-nft-mint/src/libraries/aa-sdk)
