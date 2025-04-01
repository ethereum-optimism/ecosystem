[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateWithdrawSuperchainWETHGas

# estimateWithdrawSuperchainWETHGas()

> **estimateWithdrawSuperchainWETHGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [withdrawSuperchainWETH](withdrawSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`WithdrawSuperchainWETHParameters`](../type-aliases/WithdrawSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[WithdrawSuperchainWETHParameters](../type-aliases/WithdrawSuperchainWETHParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/interop/withdrawSuperchainWETH.ts:96](https://github.com/ethereum-optimism/ecosystem/blob/ddb96adf4653afc97ea0f64c5d67dd4ec467ac08/packages/viem/src/actions/interop/withdrawSuperchainWETH.ts#L96)
