[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateExecuteL2ToL2Message

# simulateExecuteL2ToL2Message()

> **simulateExecuteL2ToL2Message**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`ExecuteL2ToL2MessageContractReturnType`](../type-aliases/ExecuteL2ToL2MessageContractReturnType.md)\>

Simulate contract call for [executeL2ToL2Message](executeL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`ExecuteL2ToL2MessageParameters`](../type-aliases/ExecuteL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[ExecuteL2ToL2MessageParameters](../type-aliases/ExecuteL2ToL2MessageParameters.md)

## Returns

`Promise`\<[`ExecuteL2ToL2MessageContractReturnType`](../type-aliases/ExecuteL2ToL2MessageContractReturnType.md)\>

The contract functions return value. [ExecuteL2ToL2MessageContractReturnType](../type-aliases/ExecuteL2ToL2MessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/executeL2ToL2Message.ts:139](https://github.com/ethereum-optimism/ecosystem/blob/c1e85d9590ff961efd71aa28bb561bf44dbc4c2d/packages/viem/src/actions/executeL2ToL2Message.ts#L139)
