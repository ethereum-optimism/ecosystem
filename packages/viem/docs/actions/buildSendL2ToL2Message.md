# buildSendL2ToL2Message

Builds & prepares parameters for a `sendMessage` transaction to initiate a cross chain L2 to L2 message.

## Usage

```ts [example.ts]
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { optimism, base } from 'viem/chains'
import { publicActionsL2 } from '@eth-optimism/viem'

export const publicClientL2 = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

const args = await publicClientL2.buildSendL2ToL2Message({
  destinationChainId: base.id,
  target: '0x...',
  message: encodeFunctionData({ ... }),
})
```

## Returns

`BuildSendL2ToL2MessageParameters`

The parameters required to execute a `sendL2ToL2Message` transaction

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
