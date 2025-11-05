[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / DepositERC20Parameters

# DepositERC20Parameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **DepositERC20Parameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `GetChainParameter`\<`TChain`, `TChainOverride`\> & `GetContractAddressParameter`\<`TDerivedChain`, `"l1StandardBridge"`\> & `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

Action to deposit an ERC20 into an OptimismMintableERC20 | OptimismSuperchainERC20 counterpart.
Unless `unsafe` is set or the `targetChain` hasn't been specified, the remote token address will
be checked to ensure a pair-wise relationship between the tokens. Specify `remoteClient` to use an
already constructed client for the destination chain.

## Type declaration

### amount

> **amount**: `bigint`

The amount of tokens to bridge

### extraData?

> `optional` **extraData**: `Hex`

Metadata to attach to the bridged message

### minGasLimit?

> `optional` **minGasLimit**: `number`

The minimums gas the relaying message will be executed with

### remoteClient?

> `optional` **remoteClient**: `Client`

Client to use for the destination chain safety check

### remoteTokenAddress

> **remoteTokenAddress**: `Address`

The address of the OptimismMintableERC20 | OptimismSuperchainERC20 to bridge into

### to?

> `optional` **to**: `Address`

The recipient address to bridge to. Defaults to the calling account

### tokenAddress

> **tokenAddress**: `Address`

The address of the ERC20 to bridge

### unsafe?

> `optional` **unsafe**: `boolean`

Whether to skip the remote token check on the destination chain

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

[packages/viem/src/actions/depositERC20.ts:35](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/actions/depositERC20.ts#L35)
