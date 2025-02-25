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

L2 Wallet Client

• **parameters**: [`SendMessageParameters`](../type-aliases/SendMessageParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendMessageParameters](../type-aliases/SendMessageParameters.md)

## Returns

`Promise`\<[`SendMessageReturnType`](../type-aliases/SendMessageReturnType.md)\>

The sendMessage transaction hash. [SendMessageReturnType](../type-aliases/SendMessageReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendMessage.ts:76](https://github.com/ethereum-optimism/ecosystem/blob/a99a99e6e8edfe86cc9b244149f498f9122cc99b/packages/viem/src/actions/interop/sendMessage.ts#L76)
