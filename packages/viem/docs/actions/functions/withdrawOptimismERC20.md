[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / withdrawOptimismERC20

# withdrawOptimismERC20()

> **withdrawOptimismERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`Hash`\>

Action to withdraw an OptimismMintableERC20 | OptimismSuperchainERC20 into its remote ERC20.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the withdrawing chain

• **parameters**: [`WithdrawOptimismERC20Parameters`](../type-aliases/WithdrawOptimismERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[WithdrawOptimismERC20Parameters](../type-aliases/WithdrawOptimismERC20Parameters.md)

## Returns

`Promise`\<`Hash`\>

The hash of the withdrawing transaction

## Example

```ts
import { withdrawOptimismERC20 } from '@eth-optimism/viem'
import { op } from '@eth-optimism/viem/chains'

const client = createPublicClient({ chain: op, transport: http() })
const hash = await withdrawOptimismERC20(client, {
  tokenAddress: '0x0000000000000000000000000000000000000000',
  amount: 1000000000000000000n,
})
```

## Defined in

[packages/viem/src/actions/withdrawOptimismERC20.ts:90](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/withdrawOptimismERC20.ts#L90)
