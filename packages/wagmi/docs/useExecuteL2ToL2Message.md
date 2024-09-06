# useExecuteL2ToL2Message

Executes an L2 to L2 message. Used in the interop flow.

## Usage

```ts [example.ts]
const {
    executeMessage,
    isError,
    isPending,
} = useExecuteL2ToL2Message()

const hash = await executeMessage({
    account: address,
    id: messageIdentifier as MessageIdentifier,
    target: contracts.l2ToL2CrossDomainMessenger.address,
    message: message as Hex,
    chain: destinationChain,
})
```

## Returns

### `executeMessage`

- **Type:** `(params: ExecuteL2ToL2MessageParameters) => Promise<`0x${string}`>`

Call this function with the [ExecuteL2ToL2MessageParameters](https://github.com/ethereum-optimism/ecosystem/blob/main/packages/viem/docs/actions/executeL2ToL2Message.md#parameters) to execute a cross chain message

### `isError`

- **Type:** `boolean`

This will be true if there was an error attempting the cross chain message 

### `isPending`

- **Type:** `boolean`

This will be true while the request is in flight

### `isSuccess`

- **Type:** `boolean`

This will be true after the request has returned successfully

