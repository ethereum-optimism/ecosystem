# Contract ABI Signatures

> [!NOTE]  
> This document is auto-generated. Do not edit it manually.

Function signatures, event topics, and error selectors for all contracts in the viem package. Each signature is accompanied by its 4-byte selector (for functions and errors) or 32-byte topic hash (for events).

## CrossDomainMessenger

### Functions

```solidity
MESSAGE_VERSION()
0x3f827a5a

MIN_GAS_CALLDATA_OVERHEAD()
0x028f85f7

MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR()
0x0c568498

MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR()
0x2828d7e8

OTHER_MESSENGER()
0x9fce812c

RELAY_CALL_OVERHEAD()
0x4c1d6a69

RELAY_CONSTANT_OVERHEAD()
0x83a74074

RELAY_GAS_CHECK_BUFFER()
0x5644cfdf

RELAY_RESERVED_GAS()
0x8cbeeef2

baseGas(bytes,uint32)
0xb28ade25

failedMessages(bytes32)
0xa4e7f8bd

messageNonce()
0xecc70428

otherMessenger()
0xdb505d80

paused()
0x5c975abb

relayMessage(uint256,address,address,uint256,uint256,bytes)
0xd764ad0b

sendMessage(address,bytes,uint32)
0x3dbb202b

successfulMessages(bytes32)
0xb1b1b209

xDomainMessageSender()
0x6e296e45

```

### Events

```solidity
FailedRelayedMessage(bytes32)
0x99d0e048484baa1b1540b1367cb128acd7ab2946d1ed91ec10e3c85e4bf51b8f

Initialized(uint8)
0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498

RelayedMessage(bytes32)
0x4641df4a962071e12719d8c8c8e5ac7fc4d97b927346a3d7a335b1f7517e133c

SentMessage(address,address,bytes,uint256,uint256)
0xcb0f7ffd78f9aee47a248fae8db181db6eee833039123e026dcbff529522e52a

SentMessageExtension1(address,uint256)
0x8ebb2ec2465bdb2a06a66fc37a0963af8a2a6a1479d81d56fdb8cbb98096d546

```

## CrossL2Inbox

### Functions

```solidity
blockNumber()
0x57e871e7

chainId()
0x9a8a0592

interopStart()
0xb1745ada

logIndex()
0xda99f729

origin()
0x938b5f32

setInteropStart()
0xc8ab72ca

timestamp()
0xb80777ea

validateMessage((address,uint256,uint256,uint256,uint256),bytes32)
0xab4d6f75

version()
0x54fd4d50

```

### Events

```solidity
ExecutingMessage(bytes32,(address,uint256,uint256,uint256,uint256))
0x5c37832d2e8d10e346e55ad62071a6a2f9fa5130614ef2ec6617555c6f467ba7

```

### Errors

```solidity
InteropStartAlreadySet()
0xf5d97ff6

NoExecutingDeposits()
0x753f1072

NotDepositor()
0x3cc50b45

NotEntered()
0xbca35af6

ReentrantCall()
0x37ed32e8

```

## L2ToL2CrossDomainMessenger

### Functions

```solidity
crossDomainMessageContext()
0x7936cbee

crossDomainMessageSender()
0x38ffde18

crossDomainMessageSource()
0x24794462

messageNonce()
0xecc70428

messageVersion()
0x52617f3c

relayMessage((address,uint256,uint256,uint256,uint256),bytes)
0x8d1d298f

sendMessage(uint256,address,bytes)
0x7056f41f

successfulMessages(bytes32)
0xb1b1b209

version()
0x54fd4d50

```

### Events

```solidity
RelayedMessage(uint256,uint256,bytes32)
0x5948076590932b9d173029c7df03fe386e755a61c86c7fe2671011a2faa2a379

SentMessage(uint256,address,uint256,address,bytes)
0x382409ac69001e11931a28435afef442cbfd20d9891907e8fa373ba7d351f320

```

### Errors

```solidity
EventPayloadNotSentMessage()
0xdf1eb586

IdOriginNotL2ToL2CrossDomainMessenger()
0x7987c157

InvalidChainId()
0x7a47c9a2

MessageAlreadyRelayed()
0x9ca9480b

MessageDestinationNotRelayChain()
0x31ac2211

MessageDestinationSameChain()
0x8ed9a95d

MessageTargetCrossL2Inbox()
0xa9040b12

MessageTargetL2ToL2CrossDomainMessenger()
0x4faa2509

NotEntered()
0xbca35af6

ReentrantCall()
0x37ed32e8

TargetCallFailed()
0xeda86850

```

## OptimismMintableERC20

### Functions

```solidity
BRIDGE()
0xee9a31a2

DOMAIN_SEPARATOR()
0x3644e515

PERMIT2()
0x6afdd850

REMOTE_TOKEN()
0x033964be

allowance(address,address)
0xdd62ed3e

approve(address,uint256)
0x095ea7b3

balanceOf(address)
0x70a08231

bridge()
0xe78cea92

burn(address,uint256)
0x9dc29fac

decimals()
0x313ce567

decreaseAllowance(address,uint256)
0xa457c2d7

increaseAllowance(address,uint256)
0x39509351

l1Token()
0xc01e1bd6

l2Bridge()
0xae1f6aaf

mint(address,uint256)
0x40c10f19

name()
0x06fdde03

nonces(address)
0x7ecebe00

permit(address,address,uint256,uint256,uint8,bytes32,bytes32)
0xd505accf

remoteToken()
0xd6c0b2c4

supportsInterface(bytes4)
0x01ffc9a7

symbol()
0x95d89b41

totalSupply()
0x18160ddd

transfer(address,uint256)
0xa9059cbb

transferFrom(address,address,uint256)
0x23b872dd

version()
0x54fd4d50

```

### Events

```solidity
Approval(address,address,uint256)
0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925

Burn(address,uint256)
0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5

Mint(address,uint256)
0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885

Transfer(address,address,uint256)
0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

```

## OptimismMintableERC20Factory

### Functions

```solidity
BRIDGE()
0xee9a31a2

bridge()
0xe78cea92

createOptimismMintableERC20(address,string,string)
0xce5ac90f

createOptimismMintableERC20WithDecimals(address,string,string,uint8)
0x8cf0629c

createStandardL2Token(address,string,string)
0x896f93d1

deployments(address)
0x316b3739

initialize(address)
0xc4d66de8

version()
0x54fd4d50

```

### Events

```solidity
Initialized(uint8)
0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498

OptimismMintableERC20Created(address,address,address)
0x52fe89dd5930f343d25650b62fd367bae47088bcddffd2a88350a6ecdd620cdb

StandardL2TokenCreated(address,address)
0xceeb8e7d520d7f3b65fc11a262b91066940193b05d4f93df07cfdced0eb551cf

```

## StandardBridge

### Functions

```solidity
MESSENGER()
0x927ede2d

OTHER_BRIDGE()
0x7f46ddb2

bridgeERC20(address,address,uint256,uint32,bytes)
0x87087623

bridgeERC20To(address,address,address,uint256,uint32,bytes)
0x540abf73

bridgeETH(uint32,bytes)
0x09fc8843

bridgeETHTo(address,uint32,bytes)
0xe11013dd

deposits(address,address)
0x8f601f66

finalizeBridgeERC20(address,address,address,address,uint256,bytes)
0x0166a07a

finalizeBridgeETH(address,address,uint256,bytes)
0x1635f5fd

messenger()
0x3cb747bf

otherBridge()
0xc89701a2

paused()
0x5c975abb

```

### Events

```solidity
ERC20BridgeFinalized(address,address,address,address,uint256,bytes)
0xd59c65b35445225835c83f50b6ede06a7be047d22e357073e250d9af537518cd

ERC20BridgeInitiated(address,address,address,address,uint256,bytes)
0x7ff126db8024424bbfd9826e8ab82ff59136289ea440b04b39a0df1b03b9cabf

ETHBridgeFinalized(address,address,uint256,bytes)
0x31b2166ff604fc5672ea5df08a78081d2bc6d746cadce880747f3643d819e83d

ETHBridgeInitiated(address,address,uint256,bytes)
0x2849b43074093a05396b6f2a937dee8565b15a48a7b3d4bffb732a5017380af5

Initialized(uint8)
0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498

```

## SuperchainERC20

### Functions

```solidity
DOMAIN_SEPARATOR()
0x3644e515

allowance(address,address)
0xdd62ed3e

approve(address,uint256)
0x095ea7b3

balanceOf(address)
0x70a08231

crosschainBurn(address,uint256)
0x2b8c49e3

crosschainMint(address,uint256)
0x18bf5077

decimals()
0x313ce567

name()
0x06fdde03

nonces(address)
0x7ecebe00

permit(address,address,uint256,uint256,uint8,bytes32,bytes32)
0xd505accf

supportsInterface(bytes4)
0x01ffc9a7

symbol()
0x95d89b41

totalSupply()
0x18160ddd

transfer(address,uint256)
0xa9059cbb

transferFrom(address,address,uint256)
0x23b872dd

version()
0x54fd4d50

```

### Events

```solidity
Approval(address,address,uint256)
0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925

CrosschainBurn(address,uint256,address)
0xb90795a66650155983e242cac3e1ac1a4dc26f8ed2987f3ce416a34e00111fd4

CrosschainMint(address,uint256,address)
0xde22baff038e3a3e08407cbdf617deed74e869a7ba517df611e33131c6e6ea04

Transfer(address,address,uint256)
0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

```

### Errors

```solidity
AllowanceOverflow()
0xf9067066

AllowanceUnderflow()
0x8301ab38

InsufficientAllowance()
0x13be252b

InsufficientBalance()
0xf4d678b8

InvalidPermit()
0xddafbaef

Permit2AllowanceIsFixedAtInfinity()
0x3f68539a

PermitExpired()
0x1a15a3cc

TotalSupplyOverflow()
0xe5cfe957

Unauthorized()
0x82b42900

```

## SuperchainTokenBridge

### Functions

```solidity
relayERC20(address,address,address,uint256)
0x7cfd6dbc

sendERC20(address,address,uint256,uint256)
0xc1a433d8

version()
0x54fd4d50

```

### Events

```solidity
RelayERC20(address,address,address,uint256,uint256)
0x434965d7426acf45a548f00783c067e9ad789c8c66444f0a5ad8941d5005be93

SendERC20(address,address,address,uint256,uint256)
0x0247bfe63a1aaa59e073e20b172889babfda8d3273b5798e0e9ac4388e6dd11c

```

### Errors

```solidity
InvalidCrossDomainSender()
0xbc22e2aa

InvalidERC7802()
0x0ed63dae

Unauthorized()
0x82b42900

ZeroAddress()
0xd92e233d

```

## SuperchainWETH

### Functions

```solidity
allowance(address,address)
0xdd62ed3e

approve(address,uint256)
0x095ea7b3

balanceOf(address)
0x70a08231

crosschainBurn(address,uint256)
0x2b8c49e3

crosschainMint(address,uint256)
0x18bf5077

decimals()
0x313ce567

deposit()
0xd0e30db0

name()
0x06fdde03

relayETH(address,address,uint256)
0x4f0edcc9

sendETH(address,uint256)
0x64a197f3

supportsInterface(bytes4)
0x01ffc9a7

symbol()
0x95d89b41

totalSupply()
0x18160ddd

transfer(address,uint256)
0xa9059cbb

transferFrom(address,address,uint256)
0x23b872dd

version()
0x54fd4d50

withdraw(uint256)
0x2e1a7d4d

```

### Events

```solidity
Approval(address,address,uint256)
0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925

CrosschainBurn(address,uint256,address)
0xb90795a66650155983e242cac3e1ac1a4dc26f8ed2987f3ce416a34e00111fd4

CrosschainMint(address,uint256,address)
0xde22baff038e3a3e08407cbdf617deed74e869a7ba517df611e33131c6e6ea04

Deposit(address,uint256)
0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c

RelayETH(address,address,uint256,uint256)
0xe5479bb8ebad3b9ac81f55f424a6289cf0a54ff2641708f41dcb2b26f264d359

SendETH(address,address,uint256,uint256)
0xed98a2ff78833375c368471a747cdf0633024dde3f870feb08a934ac5be83402

Transfer(address,address,uint256)
0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

Withdrawal(address,uint256)
0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65

```

### Errors

```solidity
InvalidCrossDomainSender()
0xbc22e2aa

Unauthorized()
0x82b42900

ZeroAddress()
0xd92e233d

```

