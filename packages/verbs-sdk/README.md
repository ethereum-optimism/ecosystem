# @eth-optimism/verbs-sdk

Verbs is an SDK of web3 abstractions and adapters for building applications on the OP stack.

## Installation

```bash
npm install @eth-optimism/verbs-sdk
```

## Quick Start

Initialize the SDK with your wallet provider configuration:

```typescript
import { initVerbs } from '@eth-optimism/verbs-sdk'

const verbs = initVerbs({
  wallet: {
    type: 'privy',
    appId: 'your-privy-app-id',
    appSecret: 'your-privy-app-secret',
  },
  // MORE COMING SOON
})
```

## Usage

### Creating a Wallet

```typescript
// Create a new wallet for a user
const wallet = await verbs.createWallet('user123')

console.log(`Wallet created: ${wallet.address}`)
console.log(`Wallet ID: ${wallet.id}`)

// Get wallet balance
const balance = await wallet.getBalance()
console.log(`Balance: ${balance} wei`)
```

### Retrieving a Wallet

```typescript
// Get existing wallet by user ID
const wallet = await verbs.getWallet('user123')

if (wallet) {
  console.log(`Found wallet: ${wallet.address}`)
} else {
  console.log('Wallet not found')
}
```

## Documentation

Generate API documentation:

```bash
npm run docs
```
