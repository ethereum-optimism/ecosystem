[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / depositERC20

# depositERC20()

> **depositERC20**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`Hash`\>

Deposit an ERC20 into an OptimismMintableERC20 | OptimismSuperchainERC20.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the depositing chain

• **parameters**: [`DepositERC20Parameters`](../type-aliases/DepositERC20Parameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[DepositERC20Parameters](../type-aliases/DepositERC20Parameters.md)

## Returns

`Promise`\<`Hash`\>

The transaction hash. [DepositERC20ReturnType](../type-aliases/DepositERC20ReturnType.md)

## Example

```ts
import { depositERC20 } from '@eth-optimism/viem'
import { op } from '@eth-optimism/viem/chains'

const hash = await depositERC20(client, {
  tokenAddress: '0x0000000000000000000000000000000000000000',
  remoteTokenAddress: '0x0000000000000000000000000000000000000000',
  amount: 1000000000000000000n,
  targetChain: op,
})
```

## Defined in

[packages/viem/src/actions/depositERC20.ts:112](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/depositERC20.ts#L112)
