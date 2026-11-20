[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [index](../README.md) / interopContracts

# interopContracts

> `const` **interopContracts**: `object`

Interop Contracts

Predeploy addresses from `Predeploys.sol` in
`ethereum-optimism/optimism/packages/contracts-bedrock`.

## Type declaration

### crossL2Inbox

> `readonly` **crossL2Inbox**: `object`

### crossL2Inbox.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000022"` = `'0x4200000000000000000000000000000000000022'`

### ethLiquidity

> `readonly` **ethLiquidity**: `object`

### ethLiquidity.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000025"` = `'0x4200000000000000000000000000000000000025'`

### l2ToL2CrossDomainMessenger

> `readonly` **l2ToL2CrossDomainMessenger**: `object`

### l2ToL2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000023"` = `'0x4200000000000000000000000000000000000023'`

### superchainETHBridge

> `readonly` **superchainETHBridge**: `object`

### superchainETHBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000024"` = `'0x4200000000000000000000000000000000000024'`

### ~~superchainTokenBridge~~

> `readonly` **superchainTokenBridge**: `object`

#### Deprecated

The `SuperchainTokenBridge` predeploy is not part of OP Stack
Upgrade 22 (Lagoon): it was removed from the OP Stack contracts, so chains
that activate interop at Lagoon do not have it. It is still available on
supersim for local development.

### superchainTokenBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000028"` = `'0x4200000000000000000000000000000000000028'`

### undeliveredMessageExporter

> `readonly` **undeliveredMessageExporter**: `object`

### undeliveredMessageExporter.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000030"` = `'0x4200000000000000000000000000000000000030'`

## Defined in

[packages/viem/src/contracts.ts:33](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/contracts.ts#L33)
