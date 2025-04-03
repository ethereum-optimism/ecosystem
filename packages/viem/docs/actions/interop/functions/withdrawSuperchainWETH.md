[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / withdrawSuperchainWETH

# withdrawSuperchainWETH()

> **withdrawSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`WithdrawSuperchainWETHReturnType`](../type-aliases/WithdrawSuperchainWETHReturnType.md)\>

Withdraws ETH from the SuperchainWETH contract.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`WithdrawSuperchainWETHParameters`](../type-aliases/WithdrawSuperchainWETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[WithdrawSuperchainWETHParameters](../type-aliases/WithdrawSuperchainWETHParameters.md)

## Returns

`Promise`\<[`WithdrawSuperchainWETHReturnType`](../type-aliases/WithdrawSuperchainWETHReturnType.md)\>

transaction hash - [WithdrawSuperchainWETHReturnType](../type-aliases/WithdrawSuperchainWETHReturnType.md)

## Defined in

[packages/viem/src/actions/interop/withdrawSuperchainWETH.ts:67](https://github.com/ethereum-optimism/ecosystem/blob/509126ba0cdf7aa275bf036a8830332f4d366781/packages/viem/src/actions/interop/withdrawSuperchainWETH.ts#L67)
