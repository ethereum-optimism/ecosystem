[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / MessageIdentifier

# MessageIdentifier

> **MessageIdentifier**: `object`

Spec for [`MessageIdentifier`](https://github.com/ethereum-optimism/specs/blob/main/specs/interop/messaging.md#message-identifier).

## Type declaration

### blockNumber

> **blockNumber**: `bigint`

Block number in which the log was emitted

### chainId

> **chainId**: `bigint`

The chain id of the chain that emitted the log

### logIndex

> **logIndex**: `bigint`

The index of the log in the array of all logs emitted in the block

### origin

> **origin**: `Address`

Account that emits the SendMessage log in L2ToL2CrossDomainMessenger.

### timestamp

> **timestamp**: `bigint`

The timestamp that the log was emitted. Used to enforce the timestamp invariant

## Defined in

[packages/viem/src/types/interop.ts:7](https://github.com/ethereum-optimism/ecosystem/blob/37c6534910b25082298b9c156497899cc7f9678f/packages/viem/src/types/interop.ts#L7)
