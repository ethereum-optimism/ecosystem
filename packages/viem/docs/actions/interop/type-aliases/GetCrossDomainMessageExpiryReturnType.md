[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / GetCrossDomainMessageExpiryReturnType

# GetCrossDomainMessageExpiryReturnType

> **GetCrossDomainMessageExpiryReturnType**: `object`

## Type declaration

### expired

> **expired**: `boolean`

`true` once the source chain has marked the message expired
(`expiredMessages(messageHash)`). An expired message can never be relayed,
and the sending application can undo the send.

### expiryPeriod

> **expiryPeriod**: `bigint`

The messenger's `expiryPeriod()`, 691200 seconds (8 days) on production networks.

### exportableAfter

> **exportableAfter**: `bigint` \| `null`

The message can be marked expired only by an export
([exportUndeliveredMessage](../functions/exportUndeliveredMessage.md)) made on the destination chain at a
block timestamp strictly greater than this value (`sentAt + expiryPeriod`).
`null` when `sentAt` is `0n`.

### messageHash

> **messageHash**: \`0x$\{string\}\`

Hash of the message, as computed by the `L2ToL2CrossDomainMessenger`.

### sentAt

> **sentAt**: `bigint`

Source chain timestamp at which the message was sent
(`sentMessageTimestamps(messageHash)`). `0n` when the messenger did not
record it, for example for a message sent before OP Stack Upgrade 22
(Lagoon). Such a message can never expire.

## Defined in

packages/viem/src/actions/interop/getCrossDomainMessageExpiry.ts:21
