[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / simulateSendSupERC20

# simulateSendSupERC20()

> **simulateSendSupERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSupERC20ContractReturnType`](../type-aliases/SendSupERC20ContractReturnType.md)\>

Simulate contract call for [sendSupERC20](sendSupERC20.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Public Client

• **parameters**: [`SendSupERC20Parameters`](../type-aliases/SendSupERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendSupERC20Parameters](../type-aliases/SendSupERC20Parameters.md)

## Returns

`Promise`\<[`SendSupERC20ContractReturnType`](../type-aliases/SendSupERC20ContractReturnType.md)\>

The contract functions return value. [SendSupERC20ContractReturnType](../type-aliases/SendSupERC20ContractReturnType.md)

## Defined in

[packages/viem/src/actions/sendSupERC20.ts:132](https://github.com/ethereum-optimism/ecosystem/blob/13a9597363979821622ee318a8281c7048f1a00b/packages/viem/src/actions/sendSupERC20.ts#L132)
