[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / depositSuperchainWETH

# depositSuperchainWETH()

> **depositSuperchainWETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`DepositSuperchainWETHReturnType`](../type-aliases/DepositSuperchainWETHReturnType.md)\>

Deposits ETH to the SuperchainWETH contract.

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Client

• **parameters**: [`DepositSuperchainWETHParameters`](../type-aliases/DepositSuperchainWETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[DepositSuperchainWETHParameters](../type-aliases/DepositSuperchainWETHParameters.md)

## Returns

`Promise`\<[`DepositSuperchainWETHReturnType`](../type-aliases/DepositSuperchainWETHReturnType.md)\>

transaction hash - [DepositSuperchainWETHReturnType](../type-aliases/DepositSuperchainWETHReturnType.md)

## Example

```ts
import { createPublicClient } from 'viem'
import { http } from 'viem/transports'
import { op } from '@eth-optimism/viem/chains'
import { depositSuperchainWETH } from '@eth-optimism/viem/actions/interop'

const client = createPublicClient({ chain: op, transport: http() })
const hash = await depositSuperchainWETH(client, { account: '0x...', value: 1n })
```

## Defined in

[packages/viem/src/actions/interop/depositSuperchainWETH.ts:71](https://github.com/ethereum-optimism/ecosystem/blob/17cffb9f4d194af60c7c1f0d0e30d41e88fba084/packages/viem/src/actions/interop/depositSuperchainWETH.ts#L71)
