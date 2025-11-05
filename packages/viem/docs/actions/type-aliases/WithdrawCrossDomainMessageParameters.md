[**@eth-optimism/viem**](../../README.md) • **Docs**

***

[@eth-optimism/viem](../../README.md) / [actions](../README.md) / WithdrawCrossDomainMessageParameters

# WithdrawCrossDomainMessageParameters\<TChain, TAccount, TChainOverride, TDerivedChain\>

> **WithdrawCrossDomainMessageParameters**\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\>: `GetChainParameter`\<`TChain`, `TChainOverride`\> & `BaseWriteContractActionParameters`\<`TChain`, `TAccount`, `TChainOverride`, `TDerivedChain`\> & `object`

Withdraw a cross-domain message from the child chain (L2).

## Type declaration

### crossDomainMessengerAddress?

> `optional` **crossDomainMessengerAddress**: `Address`

The address of the CrossDomainMessenger to use. Defaults to the L2CrossDomainMessenger Predeploy

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

Client for the withdrawing chain

## Param

[WithdrawCrossDomainMessageParameters](WithdrawCrossDomainMessageParameters.md)

## Example

```ts
import { withdrawCrossDomainMessage } from '@eth-optimism/viem'
import { op } from '@eth-optimism/viem/chains'

const hash = await withdrawCrossDomainMessage(client, {
  target: '0x0000000000000000000000000000000000000000',
  message: '0x',
  targetChain: op,
})
```

## Defined in

[packages/viem/src/actions/withdrawCrossDomainMessage.ts:38](https://github.com/ethereum-optimism/ecosystem/blob/a4b870454ce0f0a79a41dda7928a11b5c8946efc/packages/viem/src/actions/withdrawCrossDomainMessage.ts#L38)
