[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / estimateWithdrawCrossDomainMessageGas

# estimateWithdrawCrossDomainMessageGas()

> **estimateWithdrawCrossDomainMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimate the gas cost of the [withdrawCrossDomainMessage](withdrawCrossDomainMessage.md) action.

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client for the withdrawing chain

• **parameters**: [`WithdrawCrossDomainMessageParameters`](../type-aliases/WithdrawCrossDomainMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[WithdrawCrossDomainMessageParameters](../type-aliases/WithdrawCrossDomainMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The gas cost

## Defined in

[packages/viem/src/actions/withdrawCrossDomainMessage.ts:151](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/actions/withdrawCrossDomainMessage.ts#L151)
