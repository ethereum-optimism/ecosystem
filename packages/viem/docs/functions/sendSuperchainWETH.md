[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / sendSuperchainWETH

# sendSuperchainWETH()

> **sendSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

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

`Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

The sendSuperchainWETH transaction hash. [SendSuperchainERC20ReturnType](../type-aliases/SendSuperchainERC20ReturnType.md)

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:53](https://github.com/ethereum-optimism/ecosystem/blob/6d6302cd415cfc874f1d86fa22a309bdd9314531/packages/viem/src/actions/sendSuperchainWETH.ts#L53)
