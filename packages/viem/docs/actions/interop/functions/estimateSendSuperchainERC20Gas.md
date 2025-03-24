[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateSendSuperchainERC20Gas

# estimateSendSuperchainERC20Gas()

> **estimateSendSuperchainERC20Gas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendSuperchainERC20](sendSuperchainERC20.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`SendSuperchainERC20Parameters`](../type-aliases/SendSuperchainERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSuperchainERC20Parameters](../type-aliases/SendSuperchainERC20Parameters.md)

## Returns

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

[packages/viem/src/actions/interop/sendSuperchainERC20.ts:106](https://github.com/ethereum-optimism/ecosystem/blob/e811aa63ad2d81436ee2008e44d114c24dafedef/packages/viem/src/actions/interop/sendSuperchainERC20.ts#L106)
