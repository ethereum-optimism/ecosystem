[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / simulateRelayCrossDomainMessage

# simulateRelayCrossDomainMessage()

> **simulateRelayCrossDomainMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayCrossDomainMessageContractReturnType`](../type-aliases/RelayCrossDomainMessageContractReturnType.md)\>

Simulate contract call for [relayCrossDomainMessage](relayCrossDomainMessage.md)

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

`Promise`\<[`RelayCrossDomainMessageContractReturnType`](../type-aliases/RelayCrossDomainMessageContractReturnType.md)\>

contract return value - [RelayCrossDomainMessageContractReturnType](../type-aliases/RelayCrossDomainMessageContractReturnType.md)

## Defined in

[packages/viem/src/actions/interop/relayCrossDomainMessage.ts:150](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/interop/relayCrossDomainMessage.ts#L150)
