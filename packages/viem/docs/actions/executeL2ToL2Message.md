# executeL2ToL2Message

Executes an L2 to L2 message. Used in the interop flow.

## Usage

```ts [example.ts]
import { createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem'
import { optimism, base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { publicActionsL2, walletActionsL2, extractMessageIdentifierFromLogs } from '@eth-optimism/viem'

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
}).extend(publicActionsL2())

export const baseWalletClient = createWalletClient({
  account: privateKeyToAccount('0x...'),
  chain: base,
  transport: http(),
}).extend(walletActionsL2())

const hash =  '0x...' // sendL2ToL2Message tx hash
const receipt = await publicClient.waitForTransactionReceipt({ hash })
const id = await extractMessageIdentifierFromLogs(publicClient, { receipt })

const hash = await baseWalletClient.executeL2ToL2Message({
  id,
  target: '0x...',
  message: encodeFunctionData({ ... }),
})
```

## Returns

`Hash`

The `executeL2ToL2Message` transaction hash.

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
