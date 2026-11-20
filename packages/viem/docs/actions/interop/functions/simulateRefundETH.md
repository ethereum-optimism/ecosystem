[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateRefundETH

# simulateRefundETH()

> **simulateRefundETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RefundETHContractReturnType`](../type-aliases/RefundETHContractReturnType.md)\>

Simulate contract call for [refundETH](refundETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client connected to the source chain of the expired send

• **parameters**: [`RefundETHParameters`](../type-aliases/RefundETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RefundETHParameters](../type-aliases/RefundETHParameters.md)

## Returns

`Promise`\<[`RefundETHContractReturnType`](../type-aliases/RefundETHContractReturnType.md)\>

contract return value - [RefundETHContractReturnType](../type-aliases/RefundETHContractReturnType.md)

## Defined in

packages/viem/src/actions/interop/refundETH.ts:174
