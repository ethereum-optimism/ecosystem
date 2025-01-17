[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateWithdrawSuperchainWETH

# simulateWithdrawSuperchainWETH()

> **simulateWithdrawSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`WithdrawSuperchainWETHContractReturnType`](../type-aliases/WithdrawSuperchainWETHContractReturnType.md)\>

Simulate contract call for [withdrawSuperchainWETH](withdrawSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`WithdrawSuperchainWETHParameters`](../type-aliases/WithdrawSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[WithdrawSuperchainWETHParameters](../type-aliases/WithdrawSuperchainWETHParameters.md)

## Returns

`Promise`\<[`WithdrawSuperchainWETHContractReturnType`](../type-aliases/WithdrawSuperchainWETHContractReturnType.md)\>

The contract functions return value. withdrawSuperchainWETHContractReturnType

## Defined in

[packages/viem/src/actions/withdrawSuperchainWETH.ts:126](https://github.com/ethereum-optimism/ecosystem/blob/6d6302cd415cfc874f1d86fa22a309bdd9314531/packages/viem/src/actions/withdrawSuperchainWETH.ts#L126)
