[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / SendETHParameters

# SendETHParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **SendETHParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### chainId

> **chainId**: `number`

Chain ID of the destination chain.

### to

> **to**: `Address`

Address to send ETH to.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/interop/sendETH.ts:26](https://github.com/ethereum-optimism/ecosystem/blob/509126ba0cdf7aa275bf036a8830332f4d366781/packages/viem/src/actions/interop/sendETH.ts#L26)
