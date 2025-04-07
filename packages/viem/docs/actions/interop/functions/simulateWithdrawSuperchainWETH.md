[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateWithdrawSuperchainWETH

# simulateWithdrawSuperchainWETH()

> **simulateWithdrawSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`WithdrawSuperchainWETHContractReturnType`](../type-aliases/WithdrawSuperchainWETHContractReturnType.md)\>

Simulate contract call for [withdrawSuperchainWETH](withdrawSuperchainWETH.md)

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

`Promise`\<[`WithdrawSuperchainWETHContractReturnType`](../type-aliases/WithdrawSuperchainWETHContractReturnType.md)\>

contract return value - [WithdrawSuperchainWETHContractReturnType](../type-aliases/WithdrawSuperchainWETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/withdrawSuperchainWETH.ts:126](https://github.com/ethereum-optimism/ecosystem/blob/509126ba0cdf7aa275bf036a8830332f4d366781/packages/viem/src/actions/interop/withdrawSuperchainWETH.ts#L126)
