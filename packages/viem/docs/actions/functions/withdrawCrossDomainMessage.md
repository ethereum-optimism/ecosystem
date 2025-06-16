[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / withdrawCrossDomainMessage

# withdrawCrossDomainMessage()

> **withdrawCrossDomainMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`WithdrawCrossDomainMessageReturnType`](../type-aliases/WithdrawCrossDomainMessageReturnType.md)\>

Withdraw a cross-domain message from the child chain (L2).

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

`Promise`\<[`WithdrawCrossDomainMessageReturnType`](../type-aliases/WithdrawCrossDomainMessageReturnType.md)\>

The transaction hash. [WithdrawCrossDomainMessageReturnType](../type-aliases/WithdrawCrossDomainMessageReturnType.md)

## Defined in

[packages/viem/src/actions/withdrawCrossDomainMessage.ts:78](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/withdrawCrossDomainMessage.ts#L78)
