[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateRefundETHGas

# estimateRefundETHGas()

> **estimateRefundETHGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [refundETH](refundETH.md)

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

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

packages/viem/src/actions/interop/refundETH.ts:147
