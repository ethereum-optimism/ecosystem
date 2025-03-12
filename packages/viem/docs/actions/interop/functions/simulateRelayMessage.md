[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateRelayMessage

# simulateRelayMessage()

> **simulateRelayMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayMessageContractReturnType`](../type-aliases/RelayMessageContractReturnType.md)\>

Simulate contract call for [relayMessage](relayMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`RelayMessageParameters`](../type-aliases/RelayMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayMessageParameters](../type-aliases/RelayMessageParameters.md)

## Returns

`Promise`\<[`RelayMessageContractReturnType`](../type-aliases/RelayMessageContractReturnType.md)\>

contract return value - [RelayMessageContractReturnType](../type-aliases/RelayMessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:141](https://github.com/ethereum-optimism/ecosystem/blob/9a896f86e34c9a727d55fa4358d5403a7c25770a/packages/viem/src/actions/interop/relayMessage.ts#L141)
