[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / DEFAULT\_EXPORT\_UNDELIVERED\_MESSAGE\_MIN\_GAS\_LIMIT

# DEFAULT\_EXPORT\_UNDELIVERED\_MESSAGE\_MIN\_GAS\_LIMIT

> `const` **DEFAULT\_EXPORT\_UNDELIVERED\_MESSAGE\_MIN\_GAS\_LIMIT**: `1000000` = `1_000_000`

Default L1 gas limit reserved for the source chain's
`L1CrossDomainMessenger.relayUndeliveredMessage` call. Most of it pays for
the deposit that call makes back to the source chain. The OP Stack
acceptance tests use the same value. If it is too low, the call is kept as a
failed message on L1 and can be replayed.

## Defined in

packages/viem/src/actions/interop/exportUndeliveredMessage.ts:32
