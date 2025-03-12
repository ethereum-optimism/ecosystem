[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / sendMessage

# sendMessage()

> **sendMessage**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendMessageReturnType`](../type-aliases/SendMessageReturnType.md)\>

Initiates the intent of sending a L2 to L2 message. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`SendMessageParameters`](../type-aliases/SendMessageParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendMessageParameters](../type-aliases/SendMessageParameters.md)

## Returns

`Promise`\<[`SendMessageReturnType`](../type-aliases/SendMessageReturnType.md)\>

transaction hash - [SendMessageReturnType](../type-aliases/SendMessageReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendMessage.ts:76](https://github.com/ethereum-optimism/ecosystem/blob/9a896f86e34c9a727d55fa4358d5403a7c25770a/packages/viem/src/actions/interop/sendMessage.ts#L76)
