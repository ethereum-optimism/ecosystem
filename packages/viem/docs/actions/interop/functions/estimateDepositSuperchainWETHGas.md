[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateDepositSuperchainWETHGas

# estimateDepositSuperchainWETHGas()

> **estimateDepositSuperchainWETHGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [depositSuperchainWETH](depositSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`DepositSuperchainWETHParameters`](../type-aliases/DepositSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[DepositSuperchainWETHParameters](../type-aliases/DepositSuperchainWETHParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/interop/depositSuperchainWETH.ts:98](https://github.com/ethereum-optimism/ecosystem/blob/e811aa63ad2d81436ee2008e44d114c24dafedef/packages/viem/src/actions/interop/depositSuperchainWETH.ts#L98)
