# Ponder Interop

A [Ponder](https://ponder.sh) indexer for op-stack interop contracts. Exposes a http api, leveraged in services such as the [autorelayer](../autorelayer-interop/README.md).

See ponder [documentation](https://ponder.sh/docs/getting-started/new-project) on how ponder works.

## Configuration

Ponder configuration is available in 2 settings.

1. `pnpm dev:supersim`. Spins up a dev instances indexing 2 local supersim instances. Chains 901 & 902
2. `pnpm dev`. Spins up a dev instance bootstrapped from chains specified from env, `PONDER_INTEROP_ENDPOINT_<chain_id>=<url>`
