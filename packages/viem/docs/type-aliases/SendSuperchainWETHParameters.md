[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / SendSuperchainWETHParameters

# SendSuperchainWETHParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **SendSuperchainWETHParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### amount

> **amount**: `bigint`

Amount of tokens to send.

### chainId

> **chainId**: `number`

Chain ID of the destination chain.

### to

> **to**: `Address`

Address to send tokens to.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:27](https://github.com/ethereum-optimism/ecosystem/blob/2fda6aba11612b1bd271ada62170b607e878a916/packages/viem/src/actions/sendSuperchainWETH.ts#L27)
