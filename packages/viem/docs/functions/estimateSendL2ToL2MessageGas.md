[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / estimateSendL2ToL2MessageGas

# estimateSendL2ToL2MessageGas()

> **estimateSendL2ToL2MessageGas**\<`TChain`, `TAccount`, `TChainOverride`\>(`client`, `parameters`): `Promise`\<`bigint`\>

Estimates gas for [sendL2ToL2Message](sendL2ToL2Message.md)

## Type Parameters

• **TChain** *extends* `undefined` \| `Chain`

• **TAccount** *extends* `undefined` \| `Account`

• **TChainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `TChain`, `TAccount`\>

L2 Wallet Client

• **parameters**: [`SendL2ToL2MessageParameters`](../type-aliases/SendL2ToL2MessageParameters.md)\<`TChain`, `TAccount`, `TChainOverride`, `DeriveChain`\<`TChain`, `TChainOverride`\>\>

[SendL2ToL2MessageParameters](../type-aliases/SendL2ToL2MessageParameters.md)

## Returns

`Promise`\<`bigint`\>

The estimated gas value.

## Defined in

[packages/viem/src/actions/sendL2ToL2Message.ts:105](https://github.com/ethereum-optimism/ecosystem/blob/c6de7f1b878b611a9ec2ae09ccf5f2ca7cfa2bce/packages/viem/src/actions/sendL2ToL2Message.ts#L105)
