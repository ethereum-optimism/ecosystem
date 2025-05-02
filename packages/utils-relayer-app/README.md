# Utils-Relayer-App

A simple autorelayer to use between interoperable networks. This relies on a stateful api to return a list of pending messages between the set of interoperable chains. The [ponder-interop](../../apps/ponder-interop/) app implements the expected API service, indexing all interopable messages from the [L2ToL2CrossDomainMessenger](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L2ToL2CrossDomainMessenger.sol).

## Configuration

Configured entirely with environment variables

```
AUTORELAYER_LOOP_INTERVAL_MS= // default 6s
AUTORELAYER_PONDER_API_URL= // default http://localhost:42069
```

There's two methods of tx submission, local & sponsored endpoint. Only one can be used

- Local: Set a private key for tx submission
- Sponsored Endpoint: Single url tx sponsored endpoint. See the [README](../../apps/sponsored-sender/README.md) for local implementation of this.

```
AUTORELAYER_PRIVATE_KEY=0x
AUTORELAYER_SPONSORED_ENDPOINT=
```
