[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / ExecuteL2ToL2MessageParameters

# ExecuteL2ToL2MessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **ExecuteL2ToL2MessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### id

> **id**: [`MessageIdentifier`](MessageIdentifier.md)

Identifier pointing to the initiating message.

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

[packages/viem/src/actions/executeL2ToL2Message.ts:30](https://github.com/ethereum-optimism/ecosystem/blob/c363acafc2b5c0db021f95b4e5fefe43bbcaf322/packages/viem/src/actions/executeL2ToL2Message.ts#L30)
