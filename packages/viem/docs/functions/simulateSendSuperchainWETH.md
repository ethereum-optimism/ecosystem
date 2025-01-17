[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateSendSuperchainWETH

# simulateSendSuperchainWETH()

> **simulateSendSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSuperchainERC20ContractReturnType`](../type-aliases/SendSuperchainERC20ContractReturnType.md)\>

Simulate contract call for [sendSuperchainWETH](sendSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`SendSuperchainWETHParameters`](../type-aliases/SendSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSuperchainWETHParameters](../type-aliases/SendSuperchainWETHParameters.md)

## Returns

`Promise`\<[`SendSuperchainERC20ContractReturnType`](../type-aliases/SendSuperchainERC20ContractReturnType.md)\>

The contract functions return value. [SendSuperchainERC20ContractReturnType](../type-aliases/SendSuperchainERC20ContractReturnType.md)

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:95](https://github.com/ethereum-optimism/ecosystem/blob/6d6302cd415cfc874f1d86fa22a309bdd9314531/packages/viem/src/actions/sendSuperchainWETH.ts#L95)
