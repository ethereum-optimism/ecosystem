[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / WithdrawOptimismERC20Parameters

# WithdrawOptimismERC20Parameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **WithdrawOptimismERC20Parameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `GetChainParameter`\<`TChain`, `TChainOverride`\> & `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

Parameters to withdraw an OptimismMintableERC20 | OptimismSuperchainERC20 into the remote token.

## Type declaration

### amount

> **amount**: `bigint`

The token amount to bridge

### bridgeAddress?

> `optional` **bridgeAddress**: `Address`

The address of the StandardBridge to use. Defaults to the L2StandardBridge Predeploy

### extraData?

> `optional` **extraData**: `Hex`

Metadata to attach to the bridged message

### minGasLimit?

> `optional` **minGasLimit**: `number`

The minimums gas the relaying message will be executed with

### to?

> `optional` **to**: `Address`

The recipient address to bridge to. Defaults to the calling account

### tokenAddress

> **tokenAddress**: `Address`

The address of the OptimismMintablERC20 token to withdraw

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/withdrawOptimismERC20.ts:31](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/actions/withdrawOptimismERC20.ts#L31)
