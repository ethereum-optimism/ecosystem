<div align="center">
  <br />
  <br />
  <a href="https://optimism.io"><img alt="Optimism" src="https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/OPTIMISM-R.svg" width=600></a>
  <br />
  <h3><a href="https://optimism.io">Optimism</a> is Ethereum, scaled.</h3>
  <br />
</div>

## Ecosystem

In this repository, you'll find numerous code references for applications & packages to help app developers build on top of the OP Stack with ease. Designed to be "aggressively open source," we encourage you to explore, modify, extend, and test the code as needed. We look forward to building with you!

## Documentation

- If you want to build on top of OP Mainnet, refer to the [Optimism Documentation](https://docs.optimism.io)
- If you want to build your own OP Stack based blockchain, refer to the [OP Stack Guide](https://docs.optimism.io/stack/getting-started)
- If you want to contribute to the OP Stack, check out the [Protocol Specs](https://github.com/ethereum-optimism/optimism/tree/develop/specs)

## Community

For technical support head over to the [GitHub Developer forum](https://github.com/ethereum-optimism/developers/discussions).
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

There will be a few common targets that you will most likely see across all applications and packages in the repo.

* `build`
* `clean`
* `dev`
* `typecheck`
* `lint`
* `lint:fix`


Feel free to open up an issue on the repo if you're running into any issues!

## Contributing

No contribution is too small and all contributions are valued.
Thanks for your help improving the project! We are so happy to have you!

You can read our contribution guide [here](./CONTRIBUTING.md) to understand better how we work in the repo.

## Releases

As of now we have not published any packages in this repo to npm, but stay tuned as we plan to do that once we add more packages to the repo!

## License

All other files within this repository are licensed under the [MIT License](https://github.com/ethereum-optimism/ecosystem/blob/main/LICENSE) unless stated otherwise.
