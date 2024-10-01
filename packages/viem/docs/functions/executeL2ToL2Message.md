[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / executeL2ToL2Message

# executeL2ToL2Message()

> **executeL2ToL2Message**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`ExecuteL2ToL2MessageReturnType`](../type-aliases/ExecuteL2ToL2MessageReturnType.md)\>

Executes the L2 to L2 message. Used in the interop flow.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client to use

• **parameters**: [`ExecuteL2ToL2MessageParameters`](../type-aliases/ExecuteL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[ExecuteL2ToL2MessageParameters](../type-aliases/ExecuteL2ToL2MessageParameters.md)

## Returns

`Promise`\<[`ExecuteL2ToL2MessageReturnType`](../type-aliases/ExecuteL2ToL2MessageReturnType.md)\>

The executeL2ToL2Message transaction hash. [ExecuteL2ToL2MessageReturnType](../type-aliases/ExecuteL2ToL2MessageReturnType.md)

## Defined in

[packages/viem/src/actions/executeL2ToL2Message.ts:78](https://github.com/ethereum-optimism/ecosystem/blob/a6a591d88cd41aa48aa7325dbb668dbe8084e5ee/packages/viem/src/actions/executeL2ToL2Message.ts#L78)
