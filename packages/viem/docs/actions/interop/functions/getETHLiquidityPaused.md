[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / getETHLiquidityPaused

# getETHLiquidityPaused()

> **getETHLiquidityPaused**\<`TChain`, `TAccount`\>(`client`): `Promise`\<[`GetETHLiquidityPausedReturnType`](../type-aliases/GetETHLiquidityPausedReturnType.md)\>

Returns whether the `ETHLiquidity` predeploy is paused on the chain the
client is connected to.

From OP Stack Upgrade 22 (Lagoon), the L1 pause applies to `ETHLiquidity`.
Anyone can copy the L1 pause state to L2 with
`L1CrossDomainMessenger.syncETHLiquidityPause()`. While `ETHLiquidity` is
paused, it blocks `burn` and `mint`, so [sendETH](sendETH.md), relaying an ETH
message, and [refundETH](refundETH.md) revert with `ETHLiquidity_Paused`.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

## Returns

`Promise`\<[`GetETHLiquidityPausedReturnType`](../type-aliases/GetETHLiquidityPausedReturnType.md)\>

`true` when paused - [GetETHLiquidityPausedReturnType](../type-aliases/GetETHLiquidityPausedReturnType.md)

## Example

```ts
import { createPublicClient, http } from 'viem'
import { op } from '@eth-optimism/viem/chains'
import { getETHLiquidityPaused } from '@eth-optimism/viem/actions/interop'

const publicClientOp = createPublicClient({ chain: op, transport: http() })
const paused = await getETHLiquidityPaused(publicClientOp)
```

## Defined in

packages/viem/src/actions/interop/getETHLiquidityPaused.ts:32
