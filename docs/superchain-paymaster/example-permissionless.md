# Using the Superchain paymaster with permissionless.js

[permissionless](https://github.com/pimlicolabs/permissionless.js) is a popular Typescript library built on top of [viem](https://viem.sh/), built by [Pimlico](https://docs.pimlico.io/). In this example we use [Kernel](https://github.com/zerodevapp/kernel) as the smart account implementation. Kernel is gas optimized, flexible, and is [one of the most widely used smart account implementation](https://www.bundlebear.com/factories/all).

## What we're building

- Using a Kernel smart account, [mint an NFT](https://optimism-sepolia.blockscout.com/token/0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6) on Optimism Sepolia using the Superchain paymaster.

## Preparation

You will need

- RPC URL for the chain to use - a regular JSON-RPC provider
- Bundler RPC URL - this should support bundler RPC methods
- Paymaster RPC URL - choose the [Superchain paymaster RPC endpoint URL](./README.md) for the chain you are using

## 1. Create a paymaster client

The Superchain paymaster has a similar API to [Pimlico](https://docs.pimlico.io/paymaster/verifying-paymaster/reference/endpoints) and [Stackup](https://docs.stackup.sh/docs/paymaster-api-rpc-methods#pm_sponsoruseroperation)'s verifying paymaster service, meaning you can use `createPimlicoPaymasterClient` directly.

```typescript
import { http } from 'viem'
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico'

// For OP Sepolia, use a different RPC url for a different chain
const PAYMASTER_RPC_URL = 'https://paymaster.optimism.io/v1/11155420/rpc'

const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterRpcUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V06,
})
```

## 2. Create a smart account with a signer

We use a randomly generated private key as the signer. You will need a RPC for the chain you are using (this is used to fetch the current state of the smart account - ie. nonces).

```typescript
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
import { signerToEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { createPublicClient, http } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const CHAIN_RPC_URL = 'https://sepolia.optimism.io/'

const publicClient = createPublicClient({
  transport: http(CHAIN_RPC_URL),
})

const signer = privateKeyToAccount(generatePrivateKey())

const kernelAccount = await signerToEcdsaKernelSmartAccount(publicClient, {
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  signer: signer,
})
```

## 3. Create a smart account client

Smart account client connects to the bundler, and sends the user operation using the bundler RPC.

```typescript
import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from 'permissionless'
import { http } from 'viem'

import { optimismSepolia } from 'viem/chains'

// Use your own bundler RPC url
const BUNDLER_RPC_URL =
  'https://api.pimlico.io/v2/optimism-sepolia/rpc?apikey=get-one-from-dashboard'

const smartAccountClient = createSmartAccountClient({
  account: kernelAccount,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  chain: optimismSepolia,
  bundlerTransport: http(BUNDLER_RPC_URL),
  middleware: {
    sponsorUserOperation: paymasterClient.sponsorUserOperation,
  },
})
```

## 4. Send a user operation

This user operation mints an [NFT](https://sepolia-optimism.etherscan.io/address/0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6)

```typescript
import { parseAbiItem } from 'viem'

const transactionHash = await smartAccountClient.writeContract({
  abi: [parseAbiItem('function mint() returns (uint256)')],
  address: '0xAB559628B94Fd9748658c46E58a85EfB52FdaCa6',
  functionName: 'mint',
})
```

You can see a working example dapp [here](https://superchain-paymaster-nft-mint-example.pages.dev/), and the source code [here](/apps/paymaster-nft-mint/src/libraries/permissionless).
