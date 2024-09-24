# sendL2ToL2Message

Initiates an L2 to L2 message. Used in the interop flow.

## Usage

```ts [example.ts]
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { optimism, base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { publicActionsL2, walletActionsL2 } from '@eth-optimism/viem'

export const publicClientL2 = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

export const walletClientL2 = createPublicClient({
  account: privateKeyToAccount('0x...'),
  chain: optimism,
  transport: http(),
}).extend(walletActionsL2())

const hash = await walletClientL2.sendL2ToL2Message({
  destinationChainId: base.id,
  target: '0x...',
  message: encodeFunctionData({ ... }),
})
```

## Returns

`Hash`

The `sendL2ToL2Message` transaction hash.

## Parameters

### destinationChainId

- **Type:** `number`

The destination chain that the message will be executed on.

### target

- **Type:** `Address`

Target contract or wallet address.

### message

- **Type:** `Hex`

Message payload to call target with.

### gas (optional)

- **Type:** `bigint`

Gas limit for transaction execution on the network. 

`null` to skip gas estimation & defer calculation to signer. 

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`. 

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.
