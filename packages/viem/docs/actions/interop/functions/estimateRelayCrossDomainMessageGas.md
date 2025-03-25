[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / estimateRelayCrossDomainMessageGas

# estimateRelayCrossDomainMessageGas()

> **estimateRelayCrossDomainMessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [relayCrossDomainMessage](relayCrossDomainMessage.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Client

• **parameters**: [`RelayCrossDomainMessageParameters`](../type-aliases/RelayCrossDomainMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayCrossDomainMessageParameters](../type-aliases/RelayCrossDomainMessageParameters.md)

## Returns

`Promise`\<`bigint`\>

estimated gas value.

## Defined in

[packages/viem/src/actions/interop/relayCrossDomainMessage.ts:120](https://github.com/ethereum-optimism/ecosystem/blob/e811aa63ad2d81436ee2008e44d114c24dafedef/packages/viem/src/actions/interop/relayCrossDomainMessage.ts#L120)
