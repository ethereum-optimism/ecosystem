[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / withdrawSuperchainWETH

# withdrawSuperchainWETH()

> **withdrawSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`WithdrawSuperchainWETHReturnType`](../type-aliases/WithdrawSuperchainWETHReturnType.md)\>

Deposits ETH to the SuperchainWETH contract.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`WithdrawSuperchainWETHParameters`](../type-aliases/WithdrawSuperchainWETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[WithdrawSuperchainWETHParameters](../type-aliases/WithdrawSuperchainWETHParameters.md)

## Returns

`Promise`\<[`WithdrawSuperchainWETHReturnType`](../type-aliases/WithdrawSuperchainWETHReturnType.md)\>

The withdrawSuperchainWETH transaction hash. [WithdrawSuperchainWETHReturnType](../type-aliases/WithdrawSuperchainWETHReturnType.md)

## Defined in

[packages/viem/src/actions/withdrawSuperchainWETH.ts:67](https://github.com/ethereum-optimism/ecosystem/blob/5b57c542e6f02774701a464de238b830e81b7ecb/packages/viem/src/actions/withdrawSuperchainWETH.ts#L67)
