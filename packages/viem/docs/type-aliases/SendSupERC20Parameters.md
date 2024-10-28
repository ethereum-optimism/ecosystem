[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / SendSupERC20Parameters

# SendSupERC20Parameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **SendSupERC20Parameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

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

### tokenAddress

> **tokenAddress**: `Address`

Token to send.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/sendSupERC20.ts:27](https://github.com/ethereum-optimism/ecosystem/blob/13a9597363979821622ee318a8281c7048f1a00b/packages/viem/src/actions/sendSupERC20.ts#L27)
