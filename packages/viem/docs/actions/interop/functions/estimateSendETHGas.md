[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateSendETHGas

# estimateSendETHGas()

> **estimateSendETHGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendETH](sendETH.md)

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

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

[packages/viem/src/actions/interop/sendETH.ts:96](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/interop/sendETH.ts#L96)
