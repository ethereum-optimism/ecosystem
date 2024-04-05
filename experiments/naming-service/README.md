# Naming Service

A trpc server that can be used for resolving ens addresses offchain. In order to set this up host this server and then deploy a [OffChainResolver](https://github.com/ensdomains/offchain-resolver/blob/099b7e9827899efcf064e71b7125f7b4fc2e342f/packages/contracts/contracts/OffchainResolver.sol) contract and set the `_url` argument to: `https://<address of this server>/{sender}/{data}.json` and the `_signers` argument to the address associated with `RESOLVER_PRIVATE_KEY` env variable. Then set the address of the deployed `OffChainResolver` contract as the resolver on the subdomain you would like to register names on.

## Getting started

#### 1. Create `.env` file and fill in empty values

```bash
cp example.env .env
```

#### 2. Start dev server

```bash
pnpm run dev
```
