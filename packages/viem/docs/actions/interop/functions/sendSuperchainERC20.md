[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / sendSuperchainERC20

# sendSuperchainERC20()

> **sendSuperchainERC20**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

Sends tokens to a target address on another chain. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`SendSuperchainERC20Parameters`](../type-aliases/SendSuperchainERC20Parameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendSuperchainERC20Parameters](../type-aliases/SendSuperchainERC20Parameters.md)

## Returns

`Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

The sendSuperchainERC20 transaction hash. [SendSuperchainERC20ReturnType](../type-aliases/SendSuperchainERC20ReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendSuperchainERC20.ts:77](https://github.com/ethereum-optimism/ecosystem/blob/8c869dbb3cc282dd35a61a60d7a8a9cae4a14cae/packages/viem/src/actions/interop/sendSuperchainERC20.ts#L77)
