[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / sendSuperchainWETH

# sendSuperchainWETH()

> **sendSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSupERC20ReturnType`](../type-aliases/SendSupERC20ReturnType.md)\>

Sends SuperchainWETH to a target address on another chain. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`SendSuperchainWETHParameters`](../type-aliases/SendSuperchainWETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendSuperchainWETHParameters](../type-aliases/SendSuperchainWETHParameters.md)

## Returns

`Promise`\<[`SendSupERC20ReturnType`](../type-aliases/SendSupERC20ReturnType.md)\>

The sendSuperchainWETH transaction hash. [SendSupERC20ReturnType](../type-aliases/SendSupERC20ReturnType.md)

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:53](https://github.com/ethereum-optimism/ecosystem/blob/5b57c542e6f02774701a464de238b830e81b7ecb/packages/viem/src/actions/sendSuperchainWETH.ts#L53)
