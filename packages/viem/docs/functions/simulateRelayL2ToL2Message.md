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

[packages/viem/src/actions/relayL2ToL2Message.ts:129](https://github.com/ethereum-optimism/ecosystem/blob/c6de7f1b878b611a9ec2ae09ccf5f2ca7cfa2bce/packages/viem/src/actions/relayL2ToL2Message.ts#L129)