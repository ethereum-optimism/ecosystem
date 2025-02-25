[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / SendMessageParameters

# SendMessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **SendMessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### destinationChainId

> **destinationChainId**: `number`

Chain ID of the destination chain.

### message

> **message**: `Hex`

Message payload to call target with.

### target

> **target**: `Address`

Target contract or wallet address.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/interop/sendMessage.ts:28](https://github.com/ethereum-optimism/ecosystem/blob/a99a99e6e8edfe86cc9b244149f498f9122cc99b/packages/viem/src/actions/interop/sendMessage.ts#L28)
