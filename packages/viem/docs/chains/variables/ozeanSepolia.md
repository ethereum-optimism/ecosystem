[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [chains](../README.md) / ozeanSepolia

# ozeanSepolia

> `const` **ozeanSepolia**: `object`

Chain Definition for Ozean Poseidon Sepolia

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

Collection of block explorers

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.name

> `readonly` **name**: `"Ozean Poseidon Sepolia Explorer"` = `'Ozean Poseidon Sepolia Explorer'`

### blockExplorers.default.url

> `readonly` **url**: `"https://ozean-testnet.explorer.caldera.xyz"` = `'https://ozean-testnet.explorer.caldera.xyz'`

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

### contracts.l1CrossDomainMessenger.11155111

> `readonly` **11155111**: `object`

### contracts.l1CrossDomainMessenger.11155111.address

> `readonly` **address**: `"0x13931872294360cAc551BA3801f061c4C86F0725"` = `'0x13931872294360cAc551BA3801f061c4C86F0725'`

### contracts.l1Erc721Bridge

> `readonly` **l1Erc721Bridge**: `object`

### contracts.l1Erc721Bridge.11155111

> `readonly` **11155111**: `object`

### contracts.l1Erc721Bridge.11155111.address

> `readonly` **address**: `"0x50d26235319abF2bA7b043A33E53bD19480d7E69"` = `'0x50d26235319abF2bA7b043A33E53bD19480d7E69'`

### contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

### contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

### contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xb9558CE3C11EC69e18632A8e5B316581e852dB91"` = `'0xb9558CE3C11EC69e18632A8e5B316581e852dB91'`

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

### contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

### contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x591d916DD9C0c37Ae5b23593C79f5074aAF6778F"` = `'0x591d916DD9C0c37Ae5b23593C79f5074aAF6778F'`

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

### contracts.portal.11155111

> `readonly` **11155111**: `object`

### contracts.portal.11155111.address

> `readonly` **address**: `"0x6EeeA09335D09870dD467FD34ECc10Fdb5106527"` = `'0x6EeeA09335D09870dD467FD34ECc10Fdb5106527'`

### contracts.systemConfig

> `readonly` **systemConfig**: `object`

### contracts.systemConfig.11155111

> `readonly` **11155111**: `object`

### contracts.systemConfig.11155111.address

> `readonly` **address**: `"0xdEC733B0643E7c3Bd06576A4C70Ca87E301EAe87"` = `'0xdEC733B0643E7c3Bd06576A4C70Ca87E301EAe87'`

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

> **id**: `7849306`

ID in number form

### name

> **name**: `"Ozean Poseidon Sepolia"`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `object`

Currency used by chain

### nativeCurrency.decimals

> `readonly` **decimals**: `18` = `18`

### nativeCurrency.name

> `readonly` **name**: `"USDX"` = `'USDX'`

### nativeCurrency.symbol

> `readonly` **symbol**: `"USDX"` = `'USDX'`

### prepareTransactionRequest?

> `optional` **prepareTransactionRequest**: `PrepareTransactionRequestFn` \| [`PrepareTransactionRequestFn`, `object`]

Function to prepare a transaction request. Runs before the transaction is filled.

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"https://ozean-testnet.rpc.caldera.xyz/http"`]

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

> **sourceId**: `11155111`

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

[packages/viem/src/chains/sepolia.ts:764](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/chains/sepolia.ts#L764)
