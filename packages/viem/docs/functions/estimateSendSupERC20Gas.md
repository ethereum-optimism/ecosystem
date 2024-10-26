[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / estimateSendSupERC20Gas

# estimateSendSupERC20Gas()

> **estimateSendSupERC20Gas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendSupERC20](sendSupERC20.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Wallet Client

• **parameters**: [`SendSupERC20Parameters`](../type-aliases/SendSupERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSupERC20Parameters](../type-aliases/SendSupERC20Parameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/sendSupERC20.ts:106](https://github.com/ethereum-optimism/ecosystem/blob/ab77241754eb52e5f63719e48141efd7250e972b/packages/viem/src/actions/sendSupERC20.ts#L106)
