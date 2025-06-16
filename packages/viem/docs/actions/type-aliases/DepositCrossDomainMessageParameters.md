[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / DepositCrossDomainMessageParameters

# DepositCrossDomainMessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **DepositCrossDomainMessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `GetChainParameter`\<`TChain`, `TChainOverride`\> & `GetContractAddressParameter`\<`TDerivedChain`, `"l1CrossDomainMessenger"`\> & `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

Deposit a cross-domain message from the root chain (L1).

## Type declaration

### message

> **message**: `Hex`

The calldata to invoke the target with

### minGasLimit?

> `optional` **minGasLimit**: `bigint`

The minimum gas limit for the transaction

### target

> **target**: `Address`

The address of the target contract

### value

> **value**: `bigint`

The value to send with the transaction

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined`

• **TAccount** *extends* `Account` \| `undefined`

• **TChainOverride** *extends* `Chain` \| `undefined`

• **TDerivedChain** *extends* `Chain` \| `undefined` = `DeriveChain`\<`TChain`, `TChainOverride`\>

## Param

Client for the depositing chain

## Param

[DepositCrossDomainMessageParameters](DepositCrossDomainMessageParameters.md)

## Example

```ts
import { depositCrossDomainMessage } from '@eth-optimism/viem'
import { op } from '@eth-optimism/viem/chains'

const hash = await depositCrossDomainMessage(client, {
  target: '0x0000000000000000000000000000000000000000',
  message: '0x',
  targetChain: op,
})
```

## Defined in

[packages/viem/src/actions/depositCrossDomainMessage.ts:40](https://github.com/ethereum-optimism/ecosystem/blob/8c0ceae82d8e909c0d00b4601d7c7276090774cc/packages/viem/src/actions/depositCrossDomainMessage.ts#L40)
