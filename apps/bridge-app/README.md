# Example Bridge App

This is an example bridge application demonstrating how to bridge ETH & ERC20 tokens to any OP stack chain. We currently deploy this on every merge to the `main` branch. You can see what it looks like [here](https://main--magnificent-licorice-5d2277.netlify.app/).

### Setup

Create an `.env` and add `VITE_WALLET_CONNECT_PROJECT_ID` to it. You can find it [here](https://cloud.walletconnect.com/app/project).

```
VITE_WALLET_CONNECT_PROJECT_ID=<your wallet connect project id>
```

### Installation

Install the projects dependencies if you haven't already

```
pnpm i
```

### Running the development server

This application is built with `vite`, this will start the development server

```
pnpm nx run @eth-optimism/bridge-app:dev
```

### Production build

This will output a production ready build

```
pnpm nx run @eth-optimism/bridge-app:build
```
