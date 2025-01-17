[**@eth-optimism/viem**](../README.md) • **Docs**

***

[@eth-optimism/viem](../README.md) / crossChainSendETH

# crossChainSendETH()

> **crossChainSendETH**\<`chain`, `account`, `chainOverride`\>(`client`, `parameters`): `Promise`\<[`CrossChainSendETHContractReturnType`](../type-aliases/CrossChainSendETHContractReturnType.md)\>

Sends ETH to the specified recipient on the destination chain

## Type Parameters

• **chain** *extends* `undefined` \| `Chain`

• **account** *extends* `undefined` \| `Account`

• **chainOverride** *extends* `undefined` \| `Chain` = `undefined`

## Parameters

• **client**: `Client`\<`Transport`, `chain`, `account`\>

L2 Wallet Client

• **parameters**: [`CrossChainSendETHParameters`](../type-aliases/CrossChainSendETHParameters.md)\<`chain`, `account`, `chainOverride`, `DeriveChain`\<`chain`, `chainOverride`\>\>

[CrossChainSendETHParameters](../type-aliases/CrossChainSendETHParameters.md)

## Returns

`Promise`\<[`CrossChainSendETHContractReturnType`](../type-aliases/CrossChainSendETHContractReturnType.md)\>

The crosschainSendETH transaction hash. [CrossChainSendETHContractReturnType](../type-aliases/CrossChainSendETHContractReturnType.md)

## Defined in

[packages/viem/src/actions/crosschainSendETH.ts:67](https://github.com/ethereum-optimism/ecosystem/blob/6d6302cd415cfc874f1d86fa22a309bdd9314531/packages/viem/src/actions/crosschainSendETH.ts#L67)
