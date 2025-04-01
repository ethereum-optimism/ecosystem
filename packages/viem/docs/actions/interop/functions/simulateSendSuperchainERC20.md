[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateSendSuperchainERC20

# simulateSendSuperchainERC20()

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

## Defined in

[packages/viem/src/actions/interop/sendSuperchainERC20.ts:132](https://github.com/ethereum-optimism/ecosystem/blob/ddb96adf4653afc97ea0f64c5d67dd4ec467ac08/packages/viem/src/actions/interop/sendSuperchainERC20.ts#L132)
