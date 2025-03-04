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

L2 Public Client

• **parameters**: [`RelayMessageParameters`](../type-aliases/RelayMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

Relay2ToL2MessageParameters

## Returns

`Promise`\<[`RelayMessageContractReturnType`](../type-aliases/RelayMessageContractReturnType.md)\>

The contract functions return value. [RelayMessageContractReturnType](../type-aliases/RelayMessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:129](https://github.com/ethereum-optimism/ecosystem/blob/a99a99e6e8edfe86cc9b244149f498f9122cc99b/packages/viem/src/actions/interop/relayMessage.ts#L129)
