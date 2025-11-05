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

[packages/viem/src/types/interop/executingMessage.ts:7](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/types/interop/executingMessage.ts#L7)
