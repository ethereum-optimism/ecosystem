[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateExportUndeliveredMessage

# simulateExportUndeliveredMessage()

> **simulateExportUndeliveredMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`ExportUndeliveredMessageContractReturnType`](../type-aliases/ExportUndeliveredMessageContractReturnType.md)\>

Simulate contract call for [exportUndeliveredMessage](exportUndeliveredMessage.md). Reverts with
`UndeliveredMessageExporter_MessageRelayed` if the message was relayed.

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

`Promise`\<[`ExportUndeliveredMessageContractReturnType`](../type-aliases/ExportUndeliveredMessageContractReturnType.md)\>

the message hash - [ExportUndeliveredMessageContractReturnType](../type-aliases/ExportUndeliveredMessageContractReturnType.md)

## Defined in

packages/viem/src/actions/interop/exportUndeliveredMessage.ts:200
