[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / depositCrossDomainMessage

# depositCrossDomainMessage()

> **depositCrossDomainMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`DepositCrossDomainMessageReturnType`](../type-aliases/DepositCrossDomainMessageReturnType.md)\>

Deposit a cross-domain message from the root chain (L1).

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

`Promise`\<[`DepositCrossDomainMessageReturnType`](../type-aliases/DepositCrossDomainMessageReturnType.md)\>

The transaction hash. [DepositCrossDomainMessageReturnType](../type-aliases/DepositCrossDomainMessageReturnType.md)

## Defined in

[packages/viem/src/actions/depositCrossDomainMessage.ts:79](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/depositCrossDomainMessage.ts#L79)
