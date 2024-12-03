[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateCrossChainSendETH

# simulateCrossChainSendETH()

> **simulateCrossChainSendETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`CrossChainSendETHContractReturnType`](../type-aliases/CrossChainSendETHContractReturnType.md)\>

Simulate contract call for [crossChainSendETH](crossChainSendETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`CrossChainSendETHParameters`](../type-aliases/CrossChainSendETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[CrossChainSendETHParameters](../type-aliases/CrossChainSendETHParameters.md)

## Returns

`Promise`\<[`CrossChainSendETHContractReturnType`](../type-aliases/CrossChainSendETHContractReturnType.md)\>

The contract functions return value. [CrossChainSendETHContractReturnType](../type-aliases/CrossChainSendETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/crosschainSendETH.ts:122](https://github.com/ethereum-optimism/ecosystem/blob/1d855f26d1024617b154d28d909dbc33a421f5de/packages/viem/src/actions/crosschainSendETH.ts#L122)
