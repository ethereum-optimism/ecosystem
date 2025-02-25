[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / RelayMessageParameters

# RelayMessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **RelayMessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### sentMessageId

> **sentMessageId**: [`MessageIdentifier`](../../../index/type-aliases/MessageIdentifier.md)

Identifier pointing to the sent message.

### sentMessagePayload

> **sentMessagePayload**: `MessagePayload`

MessagePayload of the SentMessage event *

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:28](https://github.com/ethereum-optimism/ecosystem/blob/a99a99e6e8edfe86cc9b244149f498f9122cc99b/packages/viem/src/actions/interop/relayMessage.ts#L28)
