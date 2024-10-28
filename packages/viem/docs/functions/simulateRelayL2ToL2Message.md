[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateRelayL2ToL2Message

# simulateRelayL2ToL2Message()

> **simulateRelayL2ToL2Message**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayL2ToL2MessageContractReturnType`](../type-aliases/RelayL2ToL2MessageContractReturnType.md)\>

Simulate contract call for [relayL2ToL2Message](relayL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`RelayL2ToL2MessageParameters`](../type-aliases/RelayL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

Relay2ToL2MessageParameters

## Returns

`Promise`\<[`RelayL2ToL2MessageContractReturnType`](../type-aliases/RelayL2ToL2MessageContractReturnType.md)\>

The contract functions return value. [RelayL2ToL2MessageContractReturnType](../type-aliases/RelayL2ToL2MessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/relayL2ToL2Message.ts:129](https://github.com/ethereum-optimism/ecosystem/blob/ab77241754eb52e5f63719e48141efd7250e972b/packages/viem/src/actions/relayL2ToL2Message.ts#L129)
