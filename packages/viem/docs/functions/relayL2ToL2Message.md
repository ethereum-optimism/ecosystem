[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / relayL2ToL2Message

# relayL2ToL2Message()

> **relayL2ToL2Message**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayL2ToL2MessageReturnType`](../type-aliases/RelayL2ToL2MessageReturnType.md)\>

Relays a message emitted by the L2ToL2CrossDomainMessenger

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

`Promise`\<[`RelayL2ToL2MessageReturnType`](../type-aliases/RelayL2ToL2MessageReturnType.md)\>

The relayMessage transaction hash. [RelayL2ToL2MessageReturnType](../type-aliases/RelayL2ToL2MessageReturnType.md)

## Defined in

[packages/viem/src/actions/relayL2ToL2Message.ts:74](https://github.com/ethereum-optimism/ecosystem/blob/c6de7f1b878b611a9ec2ae09ccf5f2ca7cfa2bce/packages/viem/src/actions/relayL2ToL2Message.ts#L74)
