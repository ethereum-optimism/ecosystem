[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateExportUndeliveredMessageGas

# estimateExportUndeliveredMessageGas()

> **estimateExportUndeliveredMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [exportUndeliveredMessage](exportUndeliveredMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client connected to the message's destination chain

• **parameters**: [`ExportUndeliveredMessageParameters`](../type-aliases/ExportUndeliveredMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[ExportUndeliveredMessageParameters](../type-aliases/ExportUndeliveredMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

packages/viem/src/actions/interop/exportUndeliveredMessage.ts:169
