[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / ExportUndeliveredMessageParameters

# ExportUndeliveredMessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **ExportUndeliveredMessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### message

> **message**: `CrossDomainMessageFields`

The undelivered message. Its `destination` must be the chain the client
is connected to: the exporter hashes the message with its own chain ID.

### minGasLimit?

> `optional` **minGasLimit**: `number`

L1 gas limit for the source chain's
`L1CrossDomainMessenger.relayUndeliveredMessage` call.
Defaults to [DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT](../variables/DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT.md).

### sourceMessenger

> **sourceMessenger**: `Address`

The source chain's `L1CrossDomainMessenger`, for example
`op.contracts.l1CrossDomainMessenger[mainnet.id].address`. If it is wrong,
nothing is marked expired and the message can be exported again.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

packages/viem/src/actions/interop/exportUndeliveredMessage.ts:37
