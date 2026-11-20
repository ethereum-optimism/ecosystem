[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [chains](../README.md) / tbn

# tbn

> `const` **tbn**: `object`

Chain Definition for Binary

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

Collection of block explorers

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.name

> `readonly` **name**: `"Binary Explorer"` = `'Binary Explorer'`

### blockExplorers.default.url

> `readonly` **url**: `"https://explorer.thebinaryholdings.com"` = `'https://explorer.thebinaryholdings.com'`

### blockTime

> `readonly` **blockTime**: `2000`

Block time in milliseconds.

### contracts

> **contracts**: `object`

Collection of contracts

### contracts.create2Deployer

> `readonly` **create2Deployer**: `object`

### contracts.create2Deployer.address

> `readonly` **address**: `"0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2"` = `'0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'`

### contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

### contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

### contracts.l1Block

> `readonly` **l1Block**: `object`

### contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

### contracts.l1CrossDomainMessenger

> `readonly` **l1CrossDomainMessenger**: `object`

### contracts.l1CrossDomainMessenger.1

> `readonly` **1**: `object`

### contracts.l1CrossDomainMessenger.1.address

> `readonly` **address**: `"0x807d21e416434ae92c8E5bcA4d506781aFbBa380"` = `'0x807d21e416434ae92c8E5bcA4d506781aFbBa380'`

### contracts.l1Erc721Bridge

> `readonly` **l1Erc721Bridge**: `object`

### contracts.l1Erc721Bridge.1

> `readonly` **1**: `object`

### contracts.l1Erc721Bridge.1.address

> `readonly` **address**: `"0x1b396e4dC6ECB0be33CF01C5a34E1a3a7D03c378"` = `'0x1b396e4dC6ECB0be33CF01C5a34E1a3a7D03c378'`

### contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

### contracts.l1StandardBridge.1

> `readonly` **1**: `object`

### contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0xD1B30378CBF968E5525e8835219A5726A1e71D10"` = `'0xD1B30378CBF968E5525e8835219A5726A1e71D10'`

### contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

### contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

### contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

### contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

### contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

### contracts.l2OutputOracle.1

> `readonly` **1**: `object`

### contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x012f4baa6e0F5Ac4dFDF47BDdd9CF68a2B17821e"` = `'0x012f4baa6e0F5Ac4dFDF47BDdd9CF68a2B17821e'`

### contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

### contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

### contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

### contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

### contracts.multicall3

> `readonly` **multicall3**: `object`

### contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"` = `'0xca11bde05977b3631167028862be2a173976ca11'`

### contracts.optimismMintableERC20Factory

> `readonly` **optimismMintableERC20Factory**: `object`

### contracts.optimismMintableERC20Factory.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000012"` = `'0x4200000000000000000000000000000000000012'`

### contracts.permit2

> `readonly` **permit2**: `object`

### contracts.permit2.address

> `readonly` **address**: `"0x000000000022D473030F116dDEE9F6B43aC78BA3"` = `'0x000000000022D473030F116dDEE9F6B43aC78BA3'`

### contracts.portal

> `readonly` **portal**: `object`

### contracts.portal.1

> `readonly` **1**: `object`

### contracts.portal.1.address

> `readonly` **address**: `"0x5ff88fcF8e9947f45F4cAf8FFd5231B5DdF05e0A"` = `'0x5ff88fcF8e9947f45F4cAf8FFd5231B5DdF05e0A'`

### contracts.systemConfig

> `readonly` **systemConfig**: `object`

### contracts.systemConfig.1

> `readonly` **1**: `object`

### contracts.systemConfig.1.address

> `readonly` **address**: `"0x7aC7e5989EaC278B7BbfeF560871a2026baD472c"` = `'0x7aC7e5989EaC278B7BbfeF560871a2026baD472c'`

### contracts.weth

> `readonly` **weth**: `object`

### contracts.weth.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000006"` = `'0x4200000000000000000000000000000000000006'`

### ~~custom?~~

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### Deprecated

use `.extend` instead.

### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime**: `number`

Preconfirmation time in milliseconds.

### extendSchema?

> `optional` **extendSchema**: `Record`\<`string`, `unknown`\>

Extend schema.

### fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

Modifies how fees are derived.

### formatters

> `readonly` **formatters**: `object`

Modifies how data is formatted and typed (e.g. blocks and transactions)

### formatters.block

> `readonly` **block**: `object`

### formatters.block.exclude

> **exclude**: `undefined` \| []

### formatters.block.format()

> **format**: (`args`, `action`?) => `OpStackBlock`\<`boolean`, `BlockTag`\>

#### Parameters

• **args**: `OpStackRpcBlock`\<`BlockTag`, `boolean`\>

• **action?**: `string`

#### Returns

`OpStackBlock`\<`boolean`, `BlockTag`\>

### formatters.block.type

> **type**: `"block"`

### formatters.transaction

> `readonly` **transaction**: `object`

### formatters.transaction.exclude

> **exclude**: `undefined` \| []

### formatters.transaction.format()

> **format**: (`args`, `action`?) => `OpStackTransaction`\<`boolean`\>

#### Parameters

• **args**: `OpStackRpcTransaction`\<`boolean`\>

• **action?**: `string`

#### Returns

`OpStackTransaction`\<`boolean`\>

### formatters.transaction.type

> **type**: `"transaction"`

### formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

### formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| []

### formatters.transactionReceipt.format()

> **format**: (`args`, `action`?) => `OpStackTransactionReceipt`

#### Parameters

• **args**: `OpStackRpcTransactionReceipt`

• **action?**: `string`

#### Returns

`OpStackTransactionReceipt`

### formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

### id

> **id**: `624`

ID in number form

### name

> **name**: `"Binary"`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `object`

Currency used by chain

### nativeCurrency.decimals

> `readonly` **decimals**: `18` = `18`

### nativeCurrency.name

> `readonly` **name**: `"Binary Token"` = `'Binary Token'`

### nativeCurrency.symbol

> `readonly` **symbol**: `"BNRY"` = `'BNRY'`

### prepareTransactionRequest?

> `optional` **prepareTransactionRequest**: `PrepareTransactionRequestFn` \| [`PrepareTransactionRequestFn`, `object`]

Function to prepare a transaction request. Runs before the transaction is filled.

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"https://rpc.zero.thebinaryholdings.com"`]

### serializers

> `readonly` **serializers**: `object`

Modifies how data is serialized (e.g. transactions).

### serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature`?) => \`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| \`0x04$\{string\}\` \| `TransactionSerializedLegacy` \| \`0x7e$\{string\}\`

#### Parameters

• **transaction**: `OpStackTransactionSerializable`

• **signature?**: `Signature`

#### Returns

\`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| \`0x04$\{string\}\` \| `TransactionSerializedLegacy` \| \`0x7e$\{string\}\`

### sourceId

> **sourceId**: `1`

Source Chain ID (ie. the L1 chain)

### supportsTransactionReplacementDetection?

> `optional` **supportsTransactionReplacementDetection**: `boolean`

Whether transaction replacement detection is supported.

#### Default

```ts
true
```

### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

### transactionReplacement?

> `optional` **transactionReplacement**: `ChainTransactionReplacement`

Chain-specific transaction replacement semantics, used by
`waitForTransactionReceipt`.

### verifyHash?

> `optional` **verifyHash**: `ChainVerifyHashFn`

Chain-specific signature verification.

## Defined in

[packages/viem/src/chains/mainnet.ts:1703](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/chains/mainnet.ts#L1703)
