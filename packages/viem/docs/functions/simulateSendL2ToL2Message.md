[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateSendL2ToL2Message

# simulateSendL2ToL2Message()

> **simulateSendL2ToL2Message**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendL2ToL2MessageContractReturnType`](../type-aliases/SendL2ToL2MessageContractReturnType.md)\>

Simulate contract call for [sendL2ToL2Message](sendL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`SendL2ToL2MessageParameters`](../type-aliases/SendL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendL2ToL2MessageParameters](../type-aliases/SendL2ToL2MessageParameters.md)

## Returns

`Promise`\<[`SendL2ToL2MessageContractReturnType`](../type-aliases/SendL2ToL2MessageContractReturnType.md)\>

The contract functions return value. [SendL2ToL2MessageContractReturnType](../type-aliases/SendL2ToL2MessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/sendL2ToL2Message.ts:131](https://github.com/ethereum-optimism/ecosystem/blob/5f378d3b907e5960d4ca4cd1b4965867e0f1fb40/packages/viem/src/actions/sendL2ToL2Message.ts#L131)
