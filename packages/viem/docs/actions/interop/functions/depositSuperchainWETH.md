[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / depositSuperchainWETH

# depositSuperchainWETH()

> **depositSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`DepositSuperchainWETHReturnType`](../type-aliases/DepositSuperchainWETHReturnType.md)\>

Deposits ETH to the SuperchainWETH contract.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`DepositSuperchainWETHParameters`](../type-aliases/DepositSuperchainWETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[DepositSuperchainWETHParameters](../type-aliases/DepositSuperchainWETHParameters.md)

## Returns

`Promise`\<[`DepositSuperchainWETHReturnType`](../type-aliases/DepositSuperchainWETHReturnType.md)\>

The depositSuperchainWETH transaction hash. [DepositSuperchainWETHReturnType](../type-aliases/DepositSuperchainWETHReturnType.md)

## Defined in

[packages/viem/src/actions/interop/depositSuperchainWETH.ts:64](https://github.com/ethereum-optimism/ecosystem/blob/8c869dbb3cc282dd35a61a60d7a8a9cae4a14cae/packages/viem/src/actions/interop/depositSuperchainWETH.ts#L64)
