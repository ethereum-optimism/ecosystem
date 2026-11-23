[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / RefundETHParameters

# RefundETHParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **RefundETHParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

## Type declaration

### amount

> **amount**: `bigint`

The amount of ETH sent by the expired `sendETH`.

### destinationChainId

> **destinationChainId**: `number` \| `bigint`

Chain ID that the expired `sendETH` was sent to.

### messageNonce

> **messageNonce**: `bigint`

Nonce of the expired message (the `messageNonce` of its `SentMessage` event).

### to

> **to**: `Address`

The `to` address passed to the expired `sendETH`.

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined` = `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Defined in

packages/viem/src/actions/interop/refundETH.ts:27
