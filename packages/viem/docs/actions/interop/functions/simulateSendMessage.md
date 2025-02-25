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

[packages/viem/src/actions/interop/sendMessage.ts:131](https://github.com/ethereum-optimism/ecosystem/blob/a99a99e6e8edfe86cc9b244149f498f9122cc99b/packages/viem/src/actions/interop/sendMessage.ts#L131)
