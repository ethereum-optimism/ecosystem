<div align="center">
  <br />
  <br />
  <a href="https://optimism.io"><img alt="Optimism" src="https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/OPTIMISM-R.svg" width=600></a>
  <br />
  <h3><a href="https://optimism.io">Optimism</a> is Ethereum, scaled.</h3>
  <br />
</div>

## Ecosystem

Client-side libraries and reference applications for building **interop** apps on the OP Stack.

### What this repo is

`packages/viem` and `packages/wagmi` are the supported surface. They are the extensions app
developers use to read and write Superchain interop from a TypeScript app, and they are what the
starter kits depend on.

### What this repo is not

It is not where the protocol is built. That is the
[Optimism monorepo](https://github.com/ethereum-optimism/optimism). It is not a support boundary
for everything in the tree either: the apps here are references and local-development tools, not
production services. Anything labelled experimental below can change or disappear without a
deprecation cycle.

### Supported surface

| Package | Status | What it is |
|---|---|---|
| [`packages/viem`](./packages/viem) | **Supported** | Optimism viem extensions. The primary entry point for interop. |
| [`packages/wagmi`](./packages/wagmi) | **Supported** | Optimism wagmi extensions, built on `packages/viem`. |
| [`packages/utils-app`](./packages/utils-app) | **Supported** | Application lifecycle helpers used by the services here. |
| [`packages/supersim`](./packages/supersim) | **Supported** | npx wrapper that installs the [supersim](https://github.com/ethereum-optimism/supersim) binary. The tool itself lives in that repo. |
| [`apps/ponder-interop`](./apps/ponder-interop) | **Experimental** | Ponder indexer for interop contracts, exposing an HTTP API. |
| [`apps/sponsored-sender`](./apps/sponsored-sender) | **Experimental** | Local single-URL sponsored tx json-rpc endpoint. Explicitly not for production. |
| [`apps/superchain-playground`](./apps/superchain-playground) | **Experimental** | Demo components for OP Stack features. |

`apps/autorelayer-interop` was **removed**. See the note under Directory Structure.

### What the starter kits depend on

All six interop starter repos (`superchainerc20-starter`, `superchain-starter`,
`superchain-starter-superchainerc20`, `superchain-starter-xchain-flash-loan-example`,
`superchain-starter-xchain-eth-multitransfer`, `superchain-starter-pingpong`) declare exactly one
dependency on this repo: **`@eth-optimism/viem`**.

None of them depend on `@eth-optimism/wagmi` or on anything under `apps/`, so changes to the
experimental apps above cannot break them. `packages/viem` is the only package here with downstream
starter-kit consumers, which is the practical reason it leads this list.

Designed to be "aggressively open source," we encourage you to explore, modify, extend, and test
the code as needed. We look forward to building with you!

## Documentation

- If you want to build on top of OP Mainnet, refer to the [Optimism Documentation](https://docs.optimism.io)
- If you want to build your own OP Stack based blockchain, refer to the [OP Stack Guide](https://docs.optimism.io/stack/getting-started)
- If you want to contribute to the OP Stack, check out the [Protocol Specs](https://github.com/ethereum-optimism/optimism/tree/develop/specs)

## Support

For technical support head over to the [GitHub Developer forum](https://github.com/ethereum-optimism/developers/discussions).
Governance discussion can also be found on the [Optimism Governance Forum](https://gov.optimism.io/).

## Directory Structure

<pre>
├── <a href="./apps">apps</a>
├── ├── <a href="./apps/ponder-interop">ponder-interop</a>: Ponder indexer for Superchain interop contracts.
├── ├── <a href="./apps/sponsored-sender">sponsored-sender</a>: Util service that locally spins up single-url tx submission json-rpc endpoint
├── ├── <a href="./apps/superchain-playground">superchain-playground</a>: Playground with demo components for various op-stack features.
├── <a href="./packages">packages</a>
├── ├── <a href="./packages/supersim">supersim</a>: Util supersim package that works with npx
│   ├── <a href="./packages/viem">viem</a>: Optimism Viem Extensions
│   ├── <a href="./packages/wagmi">wagmi</a>: Optimism Wagmi Extensions
│   ├── <a href="./packages/utils-app">utils-app</a>: Optimism Application lifeycle package
</pre>

### Removed: `apps/autorelayer-interop`

The interop autorelayer that used to live here has been removed. It was superseded by a newer
relayer developed outside this repository, and keeping it here was misleading for developers
landing on it. Its history remains reachable at commit
[`62d792fe`](https://github.com/ethereum-optimism/ecosystem/tree/62d792fe05b73c4d0ceb1f99fb75c919eb634d64/apps/autorelayer-interop).

The maintained relayer now lives in
[ethereum-optimism/interop-services](https://github.com/ethereum-optimism/interop-services), which
is currently a private repository.

## Development Quick Start

### Dependencies

You'll need the following:

- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en/download/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/installation)

### Setup

Clone the repository and open it:

```bash
git clone git@github.com:ethereum-optimism/ecosystem.git
cd ecosystem
```

### Install the Correct Version of NodeJS

Install the correct node version with [nvm](https://github.com/nvm-sh/nvm)

```bash
nvm use
```

### Install Node Modules With pnpm

```bash
pnpm i
```

### Running Targets

Each application and package have npm scripts in there indivdual `package.json`.
In order to run those easily we can leverage nx here. The `nx.json` file is setup
to improve QoL while working in the repo.

The npm package name can be found in their `package.json` and the targets are what you'll see in the `scripts` object in the `package.json`

```bash
pnpm nx run <npm package name>:<target>
```

For example if we wanted to build the `viem` package or development we could run this

```bash
pnpm nx run @eth-optimism/viem:build
```

There will be a few common targets that you will most likely see across all applications and packages in the repo.

- `build`
- `clean`
- `dev`
- `typecheck`
- `lint`
- `lint:fix`

## Contributing

No contribution is too small and all contributions are valued.
Thanks for your help improving the project! We are so happy to have you!

You can read our contribution guide [here](./CONTRIBUTING.md) to understand better how we work in the repo.

## License

All other files within this repository are licensed under the [MIT License](https://github.com/ethereum-optimism/ecosystem/blob/main/LICENSE) unless stated otherwise.
