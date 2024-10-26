[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateDepositSuperchainWETH

# simulateDepositSuperchainWETH()

> **simulateDepositSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`DepositSuperchainWETHContractReturnType`](../type-aliases/DepositSuperchainWETHContractReturnType.md)\>

Simulate contract call for [depositSuperchainWETH](depositSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`DepositSuperchainWETHParameters`](../type-aliases/DepositSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[DepositSuperchainWETHParameters](../type-aliases/DepositSuperchainWETHParameters.md)

## Returns

`Promise`\<[`DepositSuperchainWETHContractReturnType`](../type-aliases/DepositSuperchainWETHContractReturnType.md)\>

The contract functions return value. depositSuperchainWETHContractReturnType

## Defined in

[packages/viem/src/actions/depositSuperchainWETH.ts:115](https://github.com/ethereum-optimism/ecosystem/blob/5b57c542e6f02774701a464de238b830e81b7ecb/packages/viem/src/actions/depositSuperchainWETH.ts#L115)
