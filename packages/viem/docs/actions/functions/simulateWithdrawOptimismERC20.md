[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / simulateWithdrawOptimismERC20

# simulateWithdrawOptimismERC20()

> **simulateWithdrawOptimismERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`WithdrawOptimismERC20ContractReturnType`\>

Simulate the [withdrawOptimismERC20](withdrawOptimismERC20.md) action.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the withdrawing chain

• **parameters**: [`WithdrawOptimismERC20Parameters`](../type-aliases/WithdrawOptimismERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[WithdrawOptimismERC20Parameters](../type-aliases/WithdrawOptimismERC20Parameters.md)

## Returns

`Promise`\<`WithdrawOptimismERC20ContractReturnType`\>

The simulated transaction

## Defined in

[packages/viem/src/actions/withdrawOptimismERC20.ts:189](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/withdrawOptimismERC20.ts#L189)
