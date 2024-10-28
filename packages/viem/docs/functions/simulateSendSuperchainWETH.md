[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateSendSuperchainWETH

# simulateSendSuperchainWETH()

> **simulateSendSuperchainWETH**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSupERC20ContractReturnType`](../type-aliases/SendSupERC20ContractReturnType.md)\>

Simulate contract call for [sendSuperchainWETH](sendSuperchainWETH.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`SendSuperchainWETHParameters`](../type-aliases/SendSuperchainWETHParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSuperchainWETHParameters](../type-aliases/SendSuperchainWETHParameters.md)

## Returns

`Promise`\<[`SendSupERC20ContractReturnType`](../type-aliases/SendSupERC20ContractReturnType.md)\>

The contract functions return value. [SendSupERC20ContractReturnType](../type-aliases/SendSupERC20ContractReturnType.md)

## Defined in

[packages/viem/src/actions/sendSuperchainWETH.ts:95](https://github.com/ethereum-optimism/ecosystem/blob/2fda6aba11612b1bd271ada62170b607e878a916/packages/viem/src/actions/sendSuperchainWETH.ts#L95)
