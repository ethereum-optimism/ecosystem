[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / sendSupERC20

# sendSupERC20()

> **sendSupERC20**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSupERC20ReturnType`](../type-aliases/SendSupERC20ReturnType.md)\>

Sends tokens to a target address on another chain. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`SendSupERC20Parameters`](../type-aliases/SendSupERC20Parameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendSupERC20Parameters](../type-aliases/SendSupERC20Parameters.md)

## Returns

`Promise`\<[`SendSupERC20ReturnType`](../type-aliases/SendSupERC20ReturnType.md)\>

The sendSupERC20 transaction hash. [SendSupERC20ReturnType](../type-aliases/SendSupERC20ReturnType.md)

## Defined in

[packages/viem/src/actions/sendSupERC20.ts:77](https://github.com/ethereum-optimism/ecosystem/blob/ab77241754eb52e5f63719e48141efd7250e972b/packages/viem/src/actions/sendSupERC20.ts#L77)
