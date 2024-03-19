# Example Bridge App

This is an example bridge application demonstrating how to bridge ETH & ERC20 tokens to any OP stack chain. We currently deploy this on every merge to the `main` branch. You can see what it looks like [here](https://main--magnificent-licorice-5d2277.netlify.app/)

This is still a WIP as we are waiting for more libraries to support Wagmi v2

### Setup

Create an `.env` and add `VITE_WALLET_CONNECT_PROJECT_ID` to it.

```
VITE_WALLET_CONNECT_PROJECT_ID=<youe wallet connect project id>
```

### Installation

Install the projects dependcies if you haven't already

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
