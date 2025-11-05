[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateSendCrossDomainMessageGas

# estimateSendCrossDomainMessageGas()

> **estimateSendCrossDomainMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for sendMessage

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`SendCrossDomainMessageParameters`](../type-aliases/SendCrossDomainMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendCrossDomainMessageParameters](../type-aliases/SendCrossDomainMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

[packages/viem/src/actions/interop/sendCrossDomainMessage.ts:106](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/actions/interop/sendCrossDomainMessage.ts#L106)
