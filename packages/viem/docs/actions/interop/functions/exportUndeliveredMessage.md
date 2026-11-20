[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / exportUndeliveredMessage

# exportUndeliveredMessage()

> **exportUndeliveredMessage**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`ExportUndeliveredMessageReturnType`](../type-aliases/ExportUndeliveredMessageReturnType.md)\>

Exports an undelivered interop message from its destination chain, using
the `UndeliveredMessageExporter` predeploy. Added in OP Stack Upgrade 22
(Lagoon).

The exporter checks that the message was not relayed on this chain and sends
`relayUndeliveredMessage(messageHash, block.timestamp)` to the source chain's
`L1CrossDomainMessenger` as an L2 to L1 withdrawal. Once that withdrawal is
proven and finalized on L1, the source chain marks the message expired. That
only succeeds if this export happens more than the source chain's
`expiryPeriod()` (8 days on production networks) after the message was sent.
See [getCrossDomainMessageExpiry](getCrossDomainMessageExpiry.md).

Anyone can call this, and it can also be forced in through a deposit if the
destination chain's sequencer does not include it.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

Client connected to the message's destination chain

• **parameters**: [`ExportUndeliveredMessageParameters`](../type-aliases/ExportUndeliveredMessageParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[ExportUndeliveredMessageParameters](../type-aliases/ExportUndeliveredMessageParameters.md)

## Returns

`Promise`\<[`ExportUndeliveredMessageReturnType`](../type-aliases/ExportUndeliveredMessageReturnType.md)\>

transaction hash - [ExportUndeliveredMessageReturnType](../type-aliases/ExportUndeliveredMessageReturnType.md)

## Example

```ts
import { createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { op, unichain } from '@eth-optimism/viem/chains'
import { exportUndeliveredMessage } from '@eth-optimism/viem/actions/interop'

// `message` was sent on OP Mainnet to Unichain and never relayed.
const walletClientUnichain = createWalletClient({ chain: unichain, transport: http(), account })
const hash = await exportUndeliveredMessage(walletClientUnichain, {
  message,
  sourceMessenger: op.contracts.l1CrossDomainMessenger[mainnet.id].address,
})
```

## Defined in

packages/viem/src/actions/interop/exportUndeliveredMessage.ts:140
