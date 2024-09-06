# extractMessageIdentifierFromLogs

Extracts `SentMessage` logs from an transaction receipt from `sendL2ToL2Message`.

## Usage

```ts
import { extractMessageIdentifierFromLogs } from '@eth-optimism/viem'

const receipt = await client.getTransactionReceipt({
  hash: '0xc9c0361bc3da9cd3560e48b469d0d6aac0e633e4897895edfd26a287f7c578ec',
})

const { id, payload } = extractMessageIdentifierFromLogs({ receipt })
```

## Returns

### id

- **Type:** `MessageIdentifier`

The Identifier that uniquely represents a log that is emitted from a chain while initiating a `sendL2ToL2Message` transaction

### payload

- **Type:** `Hex`

The payload to be executed emitted from the CrossL2ToL2DomainMessenger

## Parameters

### receipt

- **Type:** `TransactionReceipt`

Transaction receipt from a `sendL2ToL2Message` transaction.
