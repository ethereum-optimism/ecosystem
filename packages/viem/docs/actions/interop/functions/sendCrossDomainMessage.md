[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / sendCrossDomainMessage

# sendCrossDomainMessage()

> **sendCrossDomainMessage**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendCrossDomainMessageReturnType`](../type-aliases/SendCrossDomainMessageReturnType.md)\>

Initiates the intent of sending a L2 to L2 message. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`SendCrossDomainMessageParameters`](../type-aliases/SendCrossDomainMessageParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendCrossDomainMessageParameters](../type-aliases/SendCrossDomainMessageParameters.md)

## Returns

`Promise`\<[`SendCrossDomainMessageReturnType`](../type-aliases/SendCrossDomainMessageReturnType.md)\>

transaction hash - [SendCrossDomainMessageReturnType](../type-aliases/SendCrossDomainMessageReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendCrossDomainMessage.ts:77](https://github.com/ethereum-optimism/ecosystem/blob/509126ba0cdf7aa275bf036a8830332f4d366781/packages/viem/src/actions/interop/sendCrossDomainMessage.ts#L77)
