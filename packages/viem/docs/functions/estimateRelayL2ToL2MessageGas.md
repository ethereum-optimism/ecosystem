[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / estimateRelayL2ToL2MessageGas

# estimateRelayL2ToL2MessageGas()

> **estimateRelayL2ToL2MessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [relayL2ToL2Message](relayL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client to use

• **parameters**: [`RelayL2ToL2MessageParameters`](../type-aliases/RelayL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayL2ToL2MessageParameters](../type-aliases/RelayL2ToL2MessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/relayL2ToL2Message.ts:103](https://github.com/ethereum-optimism/ecosystem/blob/ab77241754eb52e5f63719e48141efd7250e972b/packages/viem/src/actions/relayL2ToL2Message.ts#L103)
