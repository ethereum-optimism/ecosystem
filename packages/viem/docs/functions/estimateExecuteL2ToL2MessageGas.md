[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / estimateExecuteL2ToL2MessageGas

# estimateExecuteL2ToL2MessageGas()

> **estimateExecuteL2ToL2MessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [executeL2ToL2Message](executeL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client to use

• **parameters**: [`ExecuteL2ToL2MessageParameters`](../type-aliases/ExecuteL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[ExecuteL2ToL2MessageParameters](../type-aliases/ExecuteL2ToL2MessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/executeL2ToL2Message.ts:111](https://github.com/ethereum-optimism/ecosystem/blob/c1e85d9590ff961efd71aa28bb561bf44dbc4c2d/packages/viem/src/actions/executeL2ToL2Message.ts#L111)
