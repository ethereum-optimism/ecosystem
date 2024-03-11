# 💳 Superchain paymaster

## Overview

The Superchain paymaster is a ERC-4337 [verifying paymaster](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/VerifyingPaymaster.sol) that sponsors transactions for smart accounts on the Superchain.

## Endpoints

| Network      | Chain ID  | Endpoint                                      |
| ------------ | --------- | --------------------------------------------- |
| Sepolia      | 11155111  | https://paymaster.optimism.io/v1/11155111/rpc |
| OP Sepolia   | 11155420  | https://paymaster.optimism.io/v1/11155420/rpc |
| Base Sepolia | 84532     | coming soon                                   |
| Zora Sepolia | 999999999 | coming soon                                   |
| Mode Sepolia | 919       | coming soon                                   |

Mainnet endpoints coming soon!

## Supported methods

### pm_sponsorUserOperation

This endpoint returns gas estimation, fee estimation, and paymaster signature for a [verifying paymaster](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/VerifyingPaymaster.sol). Gas estimation and fee estimation params are included to reduce number of RPC calls necessary when sending a user operation.

**Request**

```typescript
{
	jsonrpc: "2.0",
	id: 1,
	method: "pm_sponsorUserOperation",
	params: [
		{
			sender, // (required) address in hex string
			nonce, // (required) hex string
			initCode, // (required) hex string, if account is already deployed, pass in "0x"
			callData, // (required) hex string
			paymasterAndData, // (optional) hex string, will be ignored
			signature, // (required) hex string, can be a dummy signature that doesn't revert
			maxFeePerGas, // (optional), will override fee estimations done by the paymaster
			maxPriorityFeePerGas, // (optional) will override fee estimations done by the paymaster
			callGasLimit,  // (optional) hex string, will be ignored
			verificationGasLimit, // (optional) hex string, will be ignored
			preVerificationGas, // (optional) hex string, will be ignored
		},
		"0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // entrypoint address (required)
	],

}

```

**Response**

Include the returned fields in your user operation to send to a bundler.

```typescript
{
	jsonrpc: "2.0",
	id: 1,
	result: {
		paymasterAndData: "0x...", // paymaster signature
		callGasLimit: "0x...",  // gas estimation
		verificationGasLimit: "0x...", // gas estimation
		preVerificationGas: "0x...", // gas estimation
		maxFeePerGas: "0x...", // fee estimation
		maxPriorityFeePerGas: "0x...", // fee estimation
	},
}
```

**Regarding user operation parameters**

Only `sender`, `nonce`, `initCode`, `callData`, `signature` are required in the user operation object

| parameter            | required/optional | notes                                                             |
| -------------------- | ----------------- | ----------------------------------------------------------------- |
| sender               | required          |                                                                   |
| nonce                | required          |                                                                   |
| initCode             | required          |                                                                   |
| callData             | required          |                                                                   |
| signature            | required          | a dummy signature that won't revert                               |
| paymasterAndData     | optional          | will be ignored                                                   |
| callGasLimit         | optional          | will override. use this to set higher fee parameters if necessary |
| verificationGasLimit | optional          | will override. use this to set higher fee parameters if necessary |
| preVerificationGas   | optional          | will be ignored                                                   |
| maxFeePerGas         | optional          | will be ignored                                                   |
| maxPriorityFeePerGas | optional          | will be ignored                                                   |

- `paymasterAndData`, gas estimation, and fee estimation parameters are **optional**.
- Fee parameters (`maxFeePerGas` , `maxPriorityFeePerGas`) as part of the user operation **will act as overrides**
  - the same sent parameters will be returned (no additional fee estimation will occur)
  - this allows you to set higher fee parameters if necessary.
- Gas estimation parameters (`callGasLimit`, `verificationGasLimit`, `preVerificationGas`) **are ignored**
  - new estimation values will be returned (gas estimation will always occur)
  - we don't support overriding gas estimation parameters

**Notes**

- the returned `paymasterAndData` is signed over the **entire user operation** (including gas estimation and fee parameters), so make sure to use the values received from from the paymaster RPC **as is**.

**Example**

```json
// Request
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "pm_sponsorUserOperation",
    "params": [
        {
            "sender": "0x315b3be8741Cfb75279Fb75D20777B469A087467",
            "nonce": "0x0",
            "initCode": "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3296601cd0000000000000000000000000da6a956b9488ed4dd761e59f52fdc6c8068e6b5000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084d1f57894000000000000000000000000d9ab5096a832b9ce79914329daee236f8eea039000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000014F4f05B6ED874595c157249659B1cd79cd686c96e00000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "callData": "0x51945447000000000000000000000000ab559628b94fd9748658c46e58a85efb52fdaca60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024755edd17000000000000000000000000315b3be8741cfb75279fb75d20777b469a08746700000000000000000000000000000000000000000000000000000000",
            "paymasterAndData": "0x",
            "signature": "0x00000000fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
            "maxFeePerGas": "0xf436f",
            "maxPriorityFeePerGas": "0xf4240",
            "callGasLimit": "0x0",
            "verificationGasLimit": "0x0",
            "preVerificationGas": "0x0"
        },
        "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    ]
}


// Response
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "paymasterAndData": "0x4f84a207a80c39e9e8bae717c1f25ba7ad1fb08f000000000000000065eced22000000000000000000000000000000000000000032647b900c688ed00e12205f99559b8f9e09bf2ef7cb2ec029f9f1d59620e0dc3267ec8fa981816f1206c35db6d8d32f078130b75c102af657d74f555a5efbec1c",
        "callGasLimit": "0xf000",
        "verificationGasLimit": "0x3c6e0",
        "preVerificationGas": "0xd4ce07b",
        "maxFeePerGas": "0xf436f",
        "maxPriorityFeePerGas": "0xf4240"
    }
}
```

## Usage examples

- [Using the Superchain paymaster with aa-sdk](./example-aa-sdk.md)
- [Using the Superchain paymaster with permissionless](./example-permissionless.md)

## Supported entrypoint versions

| version | supported?     |
| ------- | -------------- |
| v0.6.0  | Supported ✅   |
| v0.7.0  | Coming soon 🔜 |

## Coming soon

- Mainnet support
- Entrypoint v0.7.0 support

## Contact us

If you're

- using smart accounts in your dapp
- bulding smart accounts
- building account abstraction tooling / infrastructure
- want to chat about your project
- have questions

reach out to us [here](https://share.hsforms.com/1fvxLHGW9TQuxdGCmgSlRRgqoshb)!
