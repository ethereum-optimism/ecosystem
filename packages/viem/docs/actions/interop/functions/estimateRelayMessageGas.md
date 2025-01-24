[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateRelayMessageGas

# estimateRelayMessageGas()

> **estimateRelayMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [relayMessage](relayMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client to use

• **parameters**: [`RelayMessageParameters`](../type-aliases/RelayMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayMessageParameters](../type-aliases/RelayMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:103](https://github.com/ethereum-optimism/ecosystem/blob/8c869dbb3cc282dd35a61a60d7a8a9cae4a14cae/packages/viem/src/actions/interop/relayMessage.ts#L103)
