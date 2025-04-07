[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateSendETH

# simulateSendETH()

> **simulateSendETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendETHContractReturnType`](../type-aliases/SendETHContractReturnType.md)\>

Simulate contract call for [sendETH](sendETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`SendETHParameters`](../type-aliases/SendETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendETHParameters](../type-aliases/SendETHParameters.md)

## Returns

`Promise`\<[`SendETHContractReturnType`](../type-aliases/SendETHContractReturnType.md)\>

contract return value - [SendETHContractReturnType](../type-aliases/SendETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendETH.ts:122](https://github.com/ethereum-optimism/ecosystem/blob/509126ba0cdf7aa275bf036a8830332f4d366781/packages/viem/src/actions/interop/sendETH.ts#L122)
