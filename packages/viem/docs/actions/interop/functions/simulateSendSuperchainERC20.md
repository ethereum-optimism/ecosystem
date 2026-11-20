[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateSendSuperchainERC20

# ~~simulateSendSuperchainERC20()~~

> **simulateSendSuperchainERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSuperchainERC20ContractReturnType`](../type-aliases/SendSuperchainERC20ContractReturnType.md)\>

Simulate contract call for [sendSuperchainERC20](sendSuperchainERC20.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`SendSuperchainERC20Parameters`](../type-aliases/SendSuperchainERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSuperchainERC20Parameters](../type-aliases/SendSuperchainERC20Parameters.md)

## Returns

`Promise`\<[`SendSuperchainERC20ContractReturnType`](../type-aliases/SendSuperchainERC20ContractReturnType.md)\>

contract return value - [SendSuperchainERC20ContractReturnType](../type-aliases/SendSuperchainERC20ContractReturnType.md)

## Deprecated

The `SuperchainTokenBridge` predeploy is not part of OP Stack
Upgrade 22 (Lagoon), so this action does not work on chains that activate
interop at Lagoon. It still works on supersim for local development.

## Defined in

[packages/viem/src/actions/interop/sendSuperchainERC20.ts:141](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/actions/interop/sendSuperchainERC20.ts#L141)
