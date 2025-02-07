[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateSendMessage

# simulateSendMessage()

> **simulateSendMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendMessageContractReturnType`](../type-aliases/SendMessageContractReturnType.md)\>

Simulate contract call for [sendMessage](sendMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`SendMessageParameters`](../type-aliases/SendMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendMessageParameters](../type-aliases/SendMessageParameters.md)

## Returns

`Promise`\<[`SendMessageContractReturnType`](../type-aliases/SendMessageContractReturnType.md)\>

The contract functions return value. [SendMessageContractReturnType](../type-aliases/SendMessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendMessage.ts:131](https://github.com/ethereum-optimism/ecosystem/blob/8c869dbb3cc282dd35a61a60d7a8a9cae4a14cae/packages/viem/src/actions/interop/sendMessage.ts#L131)
