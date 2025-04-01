[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [index](../README.md) / MessageIdentifier

# MessageIdentifier

> **MessageIdentifier**: `object`

Spec for [`MessageIdentifier`](https://github.com/ethereum-optimism/specs/blob/main/specs/interop/messaging.md#message-identifier).

## Type declaration

### blockNumber

> **blockNumber**: `bigint`

Block number in which the log was emitted

### chainId

> **chainId**: `bigint`

The chain that emitted the log

### logIndex

> **logIndex**: `bigint`

The index of the log in the array of all logs emitted in the block

### origin

> **origin**: `Address`

Account that emits log

### timestamp

> **timestamp**: `bigint`

The timestamp that the log was emitted. Used to enforce the timestamp invariant

## Defined in

[packages/viem/src/types/interop/executingMessage.ts:7](https://github.com/ethereum-optimism/ecosystem/blob/ddb96adf4653afc97ea0f64c5d67dd4ec467ac08/packages/viem/src/types/interop/executingMessage.ts#L7)
