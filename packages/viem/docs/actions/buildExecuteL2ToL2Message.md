# buildExecuteL2ToL2Message

Builds & prepares parameters for an `executeMessage` transaction to execute a cross chain L2 to L2 message.

## Usage

```ts [example.ts]
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { optimism, base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { publicActionsL2, extractMessageIdentifierFromLogs } from '@eth-optimism/viem'

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
}).extend(publicActionsL2())

const hash =  '0x...' // sendL2ToL2Message tx hash
const receipt = await publicClient.waitForTransactionReceipt({ hash })
const id = await extractMessageIdentifierFromLogs(publicClient, { receipt })

const args = await basePublicClient.buildExecuteL2ToL2Message({
  id,
  target: '0x...',
  message: encodeFunctionData({ ... }),
})
```

## Returns

`BuildExecuteL2ToL2MessageParameters`

The parameters required to execute a `executeL2ToL2Message` transaction.
## Parameters

### id

- **Type:** `MessageIdentifier`

The Identifier that uniquely represents a log that is emitted from a chain while initiating a `sendL2ToL2Message` transaction

### target

- **Type:** `Address`

Target contract or wallet address.

### message

- **Type:** `Hex`

Message payload to call target with.
