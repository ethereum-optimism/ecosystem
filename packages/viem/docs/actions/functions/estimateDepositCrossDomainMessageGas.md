[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / estimateDepositCrossDomainMessageGas

# estimateDepositCrossDomainMessageGas()

> **estimateDepositCrossDomainMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimate the gas cost of the [depositCrossDomainMessage](depositCrossDomainMessage.md) action.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the depositing chain

• **parameters**: [`DepositCrossDomainMessageParameters`](../type-aliases/DepositCrossDomainMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[DepositCrossDomainMessageParameters](../type-aliases/DepositCrossDomainMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The gas cost

## Defined in

[packages/viem/src/actions/depositCrossDomainMessage.ts:174](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/depositCrossDomainMessage.ts#L174)
