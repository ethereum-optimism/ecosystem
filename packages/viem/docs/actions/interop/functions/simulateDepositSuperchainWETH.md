[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateDepositSuperchainWETH

# simulateDepositSuperchainWETH()

> **simulateDepositSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`DepositSuperchainWETHContractReturnType`](../type-aliases/DepositSuperchainWETHContractReturnType.md)\>

Simulate contract call for [depositSuperchainWETH](depositSuperchainWETH.md)

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

`Promise`\<[`DepositSuperchainWETHContractReturnType`](../type-aliases/DepositSuperchainWETHContractReturnType.md)\>

contract return value - [DepositSuperchainWETHContractReturnType](../type-aliases/DepositSuperchainWETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/depositSuperchainWETH.ts:122](https://github.com/ethereum-optimism/ecosystem/blob/ddb96adf4653afc97ea0f64c5d67dd4ec467ac08/packages/viem/src/actions/interop/depositSuperchainWETH.ts#L122)
