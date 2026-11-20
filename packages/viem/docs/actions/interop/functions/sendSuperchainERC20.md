[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / sendSuperchainERC20

# ~~sendSuperchainERC20()~~

> **sendSuperchainERC20**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

Sends tokens to a target address on another chain. Used in the interop flow.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`SendSuperchainERC20Parameters`](../type-aliases/SendSuperchainERC20Parameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendSuperchainERC20Parameters](../type-aliases/SendSuperchainERC20Parameters.md)

## Returns

`Promise`\<[`SendSuperchainERC20ReturnType`](../type-aliases/SendSuperchainERC20ReturnType.md)\>

transaction hash - [SendSuperchainERC20ReturnType](../type-aliases/SendSuperchainERC20ReturnType.md)

## Deprecated

The `SuperchainTokenBridge` predeploy is not part of OP Stack
Upgrade 22 (Lagoon), so this action does not work on chains that activate
interop at Lagoon. It still works on supersim for local development.

## Defined in

[packages/viem/src/actions/interop/sendSuperchainERC20.ts:80](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/actions/interop/sendSuperchainERC20.ts#L80)
