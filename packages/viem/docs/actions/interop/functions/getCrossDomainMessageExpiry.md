[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / getCrossDomainMessageExpiry

# getCrossDomainMessageExpiry()

> **getCrossDomainMessageExpiry**\<`TChain`, `TAccount`\>(`client`, `parameters`): `Promise`\<[`GetCrossDomainMessageExpiryReturnType`](../type-aliases/GetCrossDomainMessageExpiryReturnType.md)\>

Get the expiry state of a cross domain message on its source chain.

Interop messages that are not relayed within the expiry window can never be
relayed. Once the message is exported as undelivered from its destination
chain (see [exportUndeliveredMessage](exportUndeliveredMessage.md)) and that withdrawal is finalized
on L1, the source chain's `L2ToL2CrossDomainMessenger` marks it expired and
emits `MessageExpired`. Applications then undo the send, as
`SuperchainETHBridge.refundETH` does (see [refundETH](refundETH.md)).

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client connected to the message's source chain

• **parameters**: [`GetCrossDomainMessageExpiryParameters`](../type-aliases/GetCrossDomainMessageExpiryParameters.md)

[GetCrossDomainMessageExpiryParameters](../type-aliases/GetCrossDomainMessageExpiryParameters.md)

## Returns

`Promise`\<[`GetCrossDomainMessageExpiryReturnType`](../type-aliases/GetCrossDomainMessageExpiryReturnType.md)\>

expiry state - [GetCrossDomainMessageExpiryReturnType](../type-aliases/GetCrossDomainMessageExpiryReturnType.md)

## Example

```ts
import { createPublicClient, http } from 'viem'
import { op } from '@eth-optimism/viem/chains'
import { getCrossDomainMessages, getCrossDomainMessageExpiry } from '@eth-optimism/viem/actions/interop'

const publicClientOp = createPublicClient({ chain: op, transport: http() })
const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
const [message] = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })

const { expired } = await getCrossDomainMessageExpiry(publicClientOp, { message })
```

## Defined in

packages/viem/src/actions/interop/getCrossDomainMessageExpiry.ts:84
