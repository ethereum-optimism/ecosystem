# estimateExecuteL2ToL2MessageGas

Estimates the gas to execute a `executeL2ToL2Message`

## Usage

```ts [example.ts]
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { optimism } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { publicActionsL2 } from '@eth-optimism/viem'

export const publicClientL2 = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

const args = await publicClientL2.estimateExecuteL2ToL2MessageGas({
  account: privateKeyToAccount('0x...'),
  id: { ... },
  target: '0x...',
  message: encodeFunctionData({ ... }),
})
```

## Returns

`bigint`

The gas estimate.

## Parameters

### account

- **Type:** `Account | Address`

The Account to estimate gas from.

Accepts a JSON-RPC Account or Local Account (Private Key, etc)

### id

- **Type:** `MessageIdentifier`

The Identifier that uniquely represents a log that is emitted from a chain while initiating a `sendL2ToL2Message` transaction

### target

- **Type:** `Address`

Target contract or wallet address.

### message

- **Type:** `Hex`

Message payload to call target with.

### maxFeePerGas (optional)

- **Type:** `bigint`

Total fee per gas (in wei), inclusive of `maxPriorityFeePerGas`. 

### maxPriorityFeePerGas (optional)

- **Type:** `bigint`

Max priority fee per gas (in wei). 

### nonce (optional)

- **Type:** `number`

Unique number identifying this transaction.
