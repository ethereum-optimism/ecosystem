[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / WithdrawSuperchainWETHParameters

# WithdrawSuperchainWETHParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **WithdrawSuperchainWETHParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### amount

> **amount**: `bigint`

Amount of SuperchainWETH to withdraw.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/withdrawSuperchainWETH.ts:26](https://github.com/ethereum-optimism/ecosystem/blob/5b57c542e6f02774701a464de238b830e81b7ecb/packages/viem/src/actions/withdrawSuperchainWETH.ts#L26)
