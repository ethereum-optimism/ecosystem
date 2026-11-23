[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / sendETH

# sendETH()

> **sendETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`SendETHContractReturnType`](../type-aliases/SendETHContractReturnType.md)\>

Sends ETH to the specified recipient on the destination chain

From OP Stack Upgrade 22 (Lagoon), if the message is not relayed on the
destination chain before it expires, the sender can get the ETH back with
[refundETH](refundETH.md) once the message is marked expired (see
[getCrossDomainMessageExpiry](getCrossDomainMessageExpiry.md)). The refund goes to the account that
called `sendETH`, not to `to`. This reverts with `ETHLiquidity_Paused`
while `ETHLiquidity` is paused (see [getETHLiquidityPaused](getETHLiquidityPaused.md)).

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`SendETHParameters`](../type-aliases/SendETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[SendETHParameters](../type-aliases/SendETHParameters.md)

## Returns

`Promise`\<[`SendETHContractReturnType`](../type-aliases/SendETHContractReturnType.md)\>

transaction hash - [SendETHContractReturnType](../type-aliases/SendETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/sendETH.ts:74](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/actions/interop/sendETH.ts#L74)
