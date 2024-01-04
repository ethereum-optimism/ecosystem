<div align="center">
  <br />
  <br />
  <a href="https://optimism.io"><img alt="Optimism" src="https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/OPTIMISM-R.svg" width=600></a>
  <br />
  <h3><a href="https://optimism.io">Optimism</a> is Ethereum, scaled.</h3>
  <br />
</div>

## What is Optimism?

[Optimism](https://www.optimism.io/) is a project dedicated to scaling Ethereum's technology and expanding its ability to coordinate people from across the world to build effective decentralized economies and governance systems. The [Optimism Collective](https://app.optimism.io/announcement) builds open-source software for running L2 blockchains and aims to address key governance and economic challenges in the wider cryptocurrency ecosystem. Optimism operates on the principle of **impact=profit**, the idea that individuals who positively impact the Collective should be proportionally rewarded with profit. **Change the incentives and you change the world.**

In this repository, you'll find numerous ecosystem components of the OP Stack, the decentralized software stack maintained by the Optimism Collective that powers Optimism and forms the backbone of blockchains like [OP Mainnet](https://explorer.optimism.io/) and [Base](https://base.org). Designed to be "aggressively open source," the OP Stack encourages you to explore, modify, extend, and test the code as needed. Packages in this repository are geared towards dapp developers looking to speed up development and getting running across all OP Stack chains.

## Documentation

- If you want to build on top of OP Mainnet, refer to the [Optimism Documentation](https://docs.optimism.io)
- If you want to build your own OP Stack based blockchain, refer to the [OP Stack Guide](https://docs.optimism.io/stack/getting-started)
- If you want to contribute to the OP Stack, check out the [Protocol Specs](https://github.com/ethereum-optimism/optimism/tree/develop/specs)

## Community

General discussion happens most frequently on the [Optimism discord](https://discord.gg/optimism).
Governance discussion can also be found on the [Optimism Governance Forum](https://gov.optimism.io/).

## Directory Structure

<pre>
├── <a href="./apps">apps</a>
│   ├── <a href="./apps/bridge-app">bridge-app</a>: Example Bridge App
├── <a href="./packages">packages</a>
│   ├── <a href="./packages/op-app">op-app</a>: Optimism Stack App Utils
</pre>

## Development Quick Start

### Dependencies

You'll need the following:

* [Git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en/download/)
* [Node Version Manager](https://github.com/nvm-sh/nvm)
* [pnpm](https://pnpm.io/installation)

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

For example if we wanted to run the `bridge-app` for development we could run this
```bash
pnpm nx run @eth-optimism/bridge-app:dev
```

If we wanted to build the `op-app` package we could run this
```bash
pnpm nx run @eth-optimism/op-app:build
```

Feel free to open up an issue on the repo if you're running into any issues!

### Contributing

No contribution is too small and all contributions are valued.
Thanks for your help improving the project! We are so happy to have you!

You can read our contribution guide [here](./CONTRIBUTING.md) to understand better how we work in the repo.

## License

All other files within this repository are licensed under the [MIT License](https://github.com/ethereum-optimism/ecosystem/blob/main/LICENSE) unless stated otherwise.