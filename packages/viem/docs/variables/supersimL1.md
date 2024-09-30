[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / supersimL1

# supersimL1

> `const` **supersimL1**: `object`

L1 chain definition for supersim in non-forked mode

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

Collection of block explorers

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.etherscan.io/api"`

### blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

### blockExplorers.default.url

> `readonly` **url**: `"https://etherscan.io"`

### contracts

> **contracts**: `object`

Collection of contracts

### contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

### contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

### contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

### contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xce01f8eee7E479C928F8919abD53E553a36CeF67"`

### contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `19258213`

### contracts.multicall3

> `readonly` **multicall3**: `object`

### contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

### contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14353601`

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

### fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

Modifies how fees are derived.

### formatters?

> `readonly` `optional` **formatters**: `undefined`

### id

> **id**: `900`

ID in number form

### name

> **name**: `"Supersim L1"`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `object`

Currency used by chain

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"http://127.0.0.1:8545"`]

### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

Modifies how data is serialized (e.g. transactions).

### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

### testnet

> **testnet**: `true`

Flag for test networks

## Defined in

[packages/viem/src/chains/supersim.ts:8](https://github.com/ethereum-optimism/ecosystem/blob/c363acafc2b5c0db021f95b4e5fefe43bbcaf322/packages/viem/src/chains/supersim.ts#L8)
