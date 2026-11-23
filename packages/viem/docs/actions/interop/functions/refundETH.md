[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / refundETH

# refundETH()

> **refundETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`RefundETHReturnType`](../type-aliases/RefundETHReturnType.md)\>

Refunds the ETH of an expired [sendETH](sendETH.md), using
`SuperchainETHBridge.refundETH`. Added in OP Stack Upgrade 22 (Lagoon).

Call it on the source chain, from the account that called `sendETH`: the
bridge rebuilds the message hash with the caller as the sender, and the
refund goes to the caller, not to `to`. It reverts with
`SuperchainETHBridge_MessageNotExpired` until the message is marked expired
(see [getCrossDomainMessageExpiry](getCrossDomainMessageExpiry.md)), and with
`SuperchainETHBridge_AlreadyRefunded` if it was already refunded.
`ETHLiquidity` must not be paused (see [getETHLiquidityPaused](getETHLiquidityPaused.md)).

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

Client connected to the source chain of the expired send

• **parameters**: [`RefundETHParameters`](../type-aliases/RefundETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[RefundETHParameters](../type-aliases/RefundETHParameters.md)

## Returns

`Promise`\<[`RefundETHReturnType`](../type-aliases/RefundETHReturnType.md)\>

transaction hash - [RefundETHReturnType](../type-aliases/RefundETHReturnType.md)

## Example

```ts
import { createWalletClient, decodeFunctionData, http } from 'viem'
import { op } from '@eth-optimism/viem/chains'
import { superchainETHBridgeAbi } from '@eth-optimism/viem/abis'
import { refundETH } from '@eth-optimism/viem/actions/interop'

// `message` is the expired SuperchainETHBridge message from getCrossDomainMessages.
const { args: [, to, amount] } = decodeFunctionData({ abi: superchainETHBridgeAbi, data: message.message })

const walletClientOp = createWalletClient({ chain: op, transport: http(), account })
const hash = await refundETH(walletClientOp, {
  destinationChainId: message.destination,
  messageNonce: message.nonce,
  to,
  amount,
})
```

## Defined in

packages/viem/src/actions/interop/refundETH.ts:112
