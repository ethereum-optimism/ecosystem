[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateSendMessageGas

# estimateSendMessageGas()

> **estimateSendMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendMessage](sendMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`SendMessageParameters`](../type-aliases/SendMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendMessageParameters](../type-aliases/SendMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

[packages/viem/src/actions/interop/sendMessage.ts:105](https://github.com/ethereum-optimism/ecosystem/blob/9a896f86e34c9a727d55fa4358d5403a7c25770a/packages/viem/src/actions/interop/sendMessage.ts#L105)
