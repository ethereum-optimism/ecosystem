[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / simulateDepositCrossDomainMessage

# simulateDepositCrossDomainMessage()

> **simulateDepositCrossDomainMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`DepositCrossDomainMessageContractReturnType`\>

Simulate the [depositCrossDomainMessage](depositCrossDomainMessage.md) action.

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

`Promise`\<`DepositCrossDomainMessageContractReturnType`\>

The contract functions return value. DepositCrossDomainMessageContractReturnType

## Defined in

[packages/viem/src/actions/depositCrossDomainMessage.ts:127](https://github.com/ethereum-optimism/ecosystem/blob/dce63954ec565887eebd9760c7ff674d954c6387/packages/viem/src/actions/depositCrossDomainMessage.ts#L127)
