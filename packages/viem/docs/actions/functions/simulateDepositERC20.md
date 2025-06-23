[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / simulateDepositERC20

# simulateDepositERC20()

> **simulateDepositERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`DepositERC20ContractReturnType`\>

Simulate the [depositERC20](depositERC20.md) action.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the depositing chain

• **parameters**: [`DepositERC20Parameters`](../type-aliases/DepositERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[DepositERC20Parameters](../type-aliases/DepositERC20Parameters.md)

## Returns

`Promise`\<`DepositERC20ContractReturnType`\>

The contract functions return value. DepositERC20ContractReturnType

## Defined in

[packages/viem/src/actions/depositERC20.ts:233](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/depositERC20.ts#L233)
