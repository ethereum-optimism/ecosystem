[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / getCrossDomainMessageStatus

# getCrossDomainMessageStatus()

> **getCrossDomainMessageStatus**\<`TChain`, `TAccount`\>(`client`, `parameters`): `Promise`\<[`GetCrossDomainMessageStatusReturnType`](../type-aliases/GetCrossDomainMessageStatusReturnType.md)\>

Get the status of a cross domain message

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

The client to use

• **parameters**: [`GetCrossDomainMessageStatusParameters`](../type-aliases/GetCrossDomainMessageStatusParameters.md)

[GetCrossDomainMessageStatusParameters](../type-aliases/GetCrossDomainMessageStatusParameters.md)

## Returns

`Promise`\<[`GetCrossDomainMessageStatusReturnType`](../type-aliases/GetCrossDomainMessageStatusReturnType.md)\>

status -[GetCrossDomainMessageStatusReturnType](../type-aliases/GetCrossDomainMessageStatusReturnType.md)

## Example

```ts
import { createPublicClient } from 'viem'
import { op, unichain } from '@eth-optimism/viem/chains'

const publicClientOp = createPublicClient({ chain: op, transport: http() })
const publicClientUnichain = createPublicClient({ chain: unichain, transport: http() })

const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
const messages = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })

const message = messages.filter((message) => message.destination === unichain.id)[0]
const status = await getCrossDomainMessageStatus(publicClientUnichain, { message })
```

## Defined in

[packages/viem/src/actions/interop/getCrossDomainMessageStatus.ts:53](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/actions/interop/getCrossDomainMessageStatus.ts#L53)
