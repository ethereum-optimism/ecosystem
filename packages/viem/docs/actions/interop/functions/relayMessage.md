[**@eth-optimism/viem**](../../../README.md) • **Docs**

***

[@eth-optimism/viem](../../../README.md) / [actions/interop](../README.md) / relayMessage

# relayMessage()

> **relayMessage**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<[`RelayMessageReturnType`](../type-aliases/RelayMessageReturnType.md)\>

Relays a message emitted by the CrossDomainMessenger

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

Client to use

• **parameters**: [`RelayMessageParameters`](../type-aliases/RelayMessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[RelayMessageParameters](../type-aliases/RelayMessageParameters.md)

## Returns

`Promise`\<[`RelayMessageReturnType`](../type-aliases/RelayMessageReturnType.md)\>

The relayMessage transaction hash. [RelayMessageReturnType](../type-aliases/RelayMessageReturnType.md)

## Defined in

[packages/viem/src/actions/interop/relayMessage.ts:74](https://github.com/ethereum-optimism/ecosystem/blob/8c869dbb3cc282dd35a61a60d7a8a9cae4a14cae/packages/viem/src/actions/interop/relayMessage.ts#L74)
