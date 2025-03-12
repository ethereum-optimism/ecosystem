[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / relayMessage

# relayMessage()

> **relayMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayMessageReturnType`](../type-aliases/RelayMessageReturnType.md)\>

Relays a message emitted by the CrossDomainMessenger

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`RelayMessageParameters`](../type-aliases/RelayMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayMessageParameters](../type-aliases/RelayMessageParameters.md)

## Returns

`Promise`\<[`RelayMessageReturnType`](../type-aliases/RelayMessageReturnType.md)\>

transaction hash - [RelayMessageReturnType](../type-aliases/RelayMessageReturnType.md)

## Example

```ts
import { createPublicClient } from 'viem'
import { http } from 'viem/transports'
import { op, unichain } from '@eth-optimism/viem/chains'

const publicClientOp = createPublicClient({ chain: op, transport: http() })
const publicClientUnichain = createPublicClient({ chain: unichain, transport: http() })

const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
const messages = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })

const message = messages.filter((message) => message.destination === unichain.id)[0]
const params = await buildExecutingMessage(publicClientOp, { log: message.log })

const hash = await relayMessage(publicClientUnichain, params)
```

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:86](https://github.com/ethereum-optimism/ecosystem/blob/9a896f86e34c9a727d55fa4358d5403a7c25770a/packages/viem/src/actions/interop/relayMessage.ts#L86)
