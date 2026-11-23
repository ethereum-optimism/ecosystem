[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [chains](../README.md) / supersimL2D

# supersimL2D

> `const` **supersimL2D**: `object`

L2 chain D definition for supersim in non-forked mode

## Type declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index Signature

 \[`key`: `string`\]: `ChainBlockExplorer`

### blockExplorers.default

> **default**: `ChainBlockExplorer`

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

### contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

### contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

### contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

### contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

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

### contracts.supersimL2DContracts

> **supersimL2DContracts**: `object`

### contracts.supersimL2DContracts.addressManager

> `readonly` **addressManager**: `object`

### contracts.supersimL2DContracts.addressManager.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.addressManager.901.address

> `readonly` **address**: `"0x3a57dec6eeda865b096c21d37336e90514af97ac"` = `'0x3a57dec6eeda865b096c21d37336e90514af97ac'`

### contracts.supersimL2DContracts.anchorStateRegistry

> `readonly` **anchorStateRegistry**: `object`

### contracts.supersimL2DContracts.anchorStateRegistry.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.anchorStateRegistry.901.address

> `readonly` **address**: `"0xfbd764e82c4e814f4eab477978e4d1de3a2ce943"` = `'0xfbd764e82c4e814f4eab477978e4d1de3a2ce943'`

### contracts.supersimL2DContracts.delayedWETHPermissionedGame

> `readonly` **delayedWETHPermissionedGame**: `object`

### contracts.supersimL2DContracts.delayedWETHPermissionedGame.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.delayedWETHPermissionedGame.901.address

> `readonly` **address**: `"0xd70797a0560f86312ccd4b4076bc348278ce3969"` = `'0xd70797a0560f86312ccd4b4076bc348278ce3969'`

### contracts.supersimL2DContracts.disputeGameFactory

> `readonly` **disputeGameFactory**: `object`

### contracts.supersimL2DContracts.disputeGameFactory.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.disputeGameFactory.901.address

> `readonly` **address**: `"0x768255ae083a774c488d3e974b3bfc9f9b3d07f3"` = `'0x768255ae083a774c488d3e974b3bfc9f9b3d07f3'`

### contracts.supersimL2DContracts.l1CrossDomainMessenger

> `readonly` **l1CrossDomainMessenger**: `object`

### contracts.supersimL2DContracts.l1CrossDomainMessenger.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.l1CrossDomainMessenger.901.address

> `readonly` **address**: `"0x285af3ef218a23f76e3ce92a8422559106b5fc9f"` = `'0x285af3ef218a23f76e3ce92a8422559106b5fc9f'`

### contracts.supersimL2DContracts.l1Erc721Bridge

> `readonly` **l1Erc721Bridge**: `object`

### contracts.supersimL2DContracts.l1Erc721Bridge.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.l1Erc721Bridge.901.address

> `readonly` **address**: `"0xe010362fe1b434554fe271ee635f017ef54666b8"` = `'0xe010362fe1b434554fe271ee635f017ef54666b8'`

### contracts.supersimL2DContracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

### contracts.supersimL2DContracts.l1StandardBridge.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.l1StandardBridge.901.address

> `readonly` **address**: `"0x6af84da4e248d66ed19894083d443d1f7a2be2ba"` = `'0x6af84da4e248d66ed19894083d443d1f7a2be2ba'`

### contracts.supersimL2DContracts.opChainProxyAdmin

> `readonly` **opChainProxyAdmin**: `object`

### contracts.supersimL2DContracts.opChainProxyAdmin.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.opChainProxyAdmin.901.address

> `readonly` **address**: `"0x3cc433e2ccf9d94e1a857c7b809ad7ac4036e16e"` = `'0x3cc433e2ccf9d94e1a857c7b809ad7ac4036e16e'`

### contracts.supersimL2DContracts.optimismMintableErc20Factory

> `readonly` **optimismMintableErc20Factory**: `object`

### contracts.supersimL2DContracts.optimismMintableErc20Factory.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.optimismMintableErc20Factory.901.address

> `readonly` **address**: `"0x563adb71a39cf3307dd4a5091a45ee6007f4e8ef"` = `'0x563adb71a39cf3307dd4a5091a45ee6007f4e8ef'`

### contracts.supersimL2DContracts.permissionedDisputeGame

> `readonly` **permissionedDisputeGame**: `object`

### contracts.supersimL2DContracts.permissionedDisputeGame.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.permissionedDisputeGame.901.address

> `readonly` **address**: `"0xadd81b137fa6b1f65099702a5f17266f142d6ce6"` = `'0xadd81b137fa6b1f65099702a5f17266f142d6ce6'`

### contracts.supersimL2DContracts.portal

> `readonly` **portal**: `object`

### contracts.supersimL2DContracts.portal.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.portal.901.address

> `readonly` **address**: `"0xde7bcd1f9fcf3a399362464c424d6d8ca493c749"` = `'0xde7bcd1f9fcf3a399362464c424d6d8ca493c749'`

### contracts.supersimL2DContracts.systemConfig

> `readonly` **systemConfig**: `object`

### contracts.supersimL2DContracts.systemConfig.901

> `readonly` **901**: `object`

### contracts.supersimL2DContracts.systemConfig.901.address

> `readonly` **address**: `"0xbf4eac91c5319577cee32c94258b5e9801bc4868"` = `'0xbf4eac91c5319577cee32c94258b5e9801bc4868'`

### contracts.supersimL2DContracts.uniV4PoolManager

> `readonly` **uniV4PoolManager**: `object`

### contracts.supersimL2DContracts.uniV4PoolManager.address

> `readonly` **address**: `"0xa1caFe2C10007B3f230B180549AF68F98F9da161"` = `'0xa1caFe2C10007B3f230B180549AF68F98F9da161'`

### contracts.supersimL2DContracts.uniV4Posm

> `readonly` **uniV4Posm**: `object`

### contracts.supersimL2DContracts.uniV4Posm.address

> `readonly` **address**: `"0xA879cbA8E7927E3486C003455824726fB06B505B"` = `'0xA879cbA8E7927E3486C003455824726fB06B505B'`

### contracts.supersimL2DContracts.uniV4Router

> `readonly` **uniV4Router**: `object`

### contracts.supersimL2DContracts.uniV4Router.address

> `readonly` **address**: `"0x08654d9B5314c439237e339858ebCF9bC0061ccB"` = `'0x08654d9B5314c439237e339858ebCF9bC0061ccB'`

### contracts.supersimL2DContracts.uniV4StateView

> `readonly` **uniV4StateView**: `object`

### contracts.supersimL2DContracts.uniV4StateView.address

> `readonly` **address**: `"0x98FD43d306458eC292944337909cd26B08b78257"` = `'0x98FD43d306458eC292944337909cd26B08b78257'`

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

> **id**: `904`

ID in number form

### name

> **name**: `"Supersim L2 D"`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `object`

Currency used by chain

### nativeCurrency.decimals

> `readonly` **decimals**: `18` = `18`

### nativeCurrency.name

> `readonly` **name**: `"Ether"` = `'Ether'`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"` = `'ETH'`

### prepareTransactionRequest?

> `optional` **prepareTransactionRequest**: `PrepareTransactionRequestFn` \| [`PrepareTransactionRequestFn`, `object`]

Function to prepare a transaction request. Runs before the transaction is filled.

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"http://127.0.0.1:9548"`]

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

> **sourceId**: `900`

Source Chain ID (ie. the L1 chain)

### supportsTransactionReplacementDetection?

> `optional` **supportsTransactionReplacementDetection**: `boolean`

Whether transaction replacement detection is supported.

#### Default

```ts
true
```

### testnet

> **testnet**: `true`

Flag for test networks

### transactionReplacement?

> `optional` **transactionReplacement**: `ChainTransactionReplacement`

Chain-specific transaction replacement semantics, used by
`waitForTransactionReceipt`.

### verifyHash?

> `optional` **verifyHash**: `ChainVerifyHashFn`

Chain-specific signature verification.

## Defined in

[packages/viem/src/chains/supersim.ts:109](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/chains/supersim.ts#L109)
