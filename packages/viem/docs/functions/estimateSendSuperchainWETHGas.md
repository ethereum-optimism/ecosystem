[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / estimateSendSuperchainWETHGas

# estimateSendSuperchainWETHGas()

> **estimateSendSuperchainWETHGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendSuperchainWETH](sendSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Wallet Client

• **parameters**: [`SendSuperchainWETHParameters`](../type-aliases/SendSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSuperchainWETHParameters](../type-aliases/SendSuperchainWETHParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:74](https://github.com/ethereum-optimism/ecosystem/blob/6d6302cd415cfc874f1d86fa22a309bdd9314531/packages/viem/src/actions/sendSuperchainWETH.ts#L74)
