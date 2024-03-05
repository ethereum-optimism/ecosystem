export type Route = {
  path: string
  label: string
}

export type Routes = Record<string, Route>

const routes: Routes = {
  CONSOLE: {
    path: '/',
    label: 'Console',
  },
  INSIGHTS: {
    path: '/insights',
    label: 'Insights',
  },
  ACCOUNT: {
    path: '/settings/account',
    label: 'Account',
  },
  CONTRACTS: {
    path: '/settings/contracts',
    label: 'Contracts',
  },
  WALLETS: {
    path: '/settings/wallets',
    label: 'Wallets',
  },
} as const satisfies Routes

const externalRoutes: Routes = {
  // Support items
  DEV_FORUM: {
    path: 'https://github.com/ethereum-optimism/developers/discussions',
    label: 'Developer Forum',
  },
  FARCASTER: {
    path: 'https://warpcast.com/~/channel/op-stack',
    label: 'Farcaster',
  },
  DISCORD: {
    path: 'https://discord.optimism.io/',
    label: 'Discord',
  },
  DAPP_EXAMPLES: {
    path: 'https://github.com/ethereum-optimism/ecosystem',
    label: 'Dapp Examples',
  },
  // Documentation items
  ETH_DOCS: {
    path: 'https://ethereum.org/developers/docs',
    label: 'Ethereum',
  },
  BASE_DOCS: {
    path: 'https://docs.base.org/',
    label: 'Base',
  },
  FRAX_DOCS: {
    path: 'https://docs.frax.finance/',
    label: 'Fraxtal',
  },
  LISK_DOCS: {
    path: 'https://documentation.lisk.com/',
    label: 'Lisk',
  },
  MODE_DOCS: {
    path: 'https://docs.mode.network/introduction/introducing-mode',
    label: 'Mode',
  },
  OPTIMISM_DOCS: {
    path: 'https://docs.optimism.io/',
    label: 'Optimism',
  },
  REDSTONE_DOCS: {
    path: 'https://redstone.xyz/docs/what-is-redstone',
    label: 'Redstone',
  },
  ZORA_DOCS: {
    path: 'https://docs.zora.co/',
    label: 'Zora',
  },
  // Project links
  SUPERCHAIN_FAUCET: {
    path: 'https://app.optimism.io/faucet',
    label: 'Superchain Faucet',
  },
  RETRO_PGF: {
    path: 'https://optimism.io/retropgf',
    label: 'Retro PGF',
  },
}

const supportItems = [
  externalRoutes.DEV_FORUM,
  externalRoutes.FARCASTER,
  externalRoutes.DISCORD,
  externalRoutes.DAPP_EXAMPLES,
]

const docsItems = [
  {
    ...externalRoutes.ETH_DOCS,
    logo: '/logos/eth-logo.png',
  },
  {
    ...externalRoutes.BASE_DOCS,
    logo: '/logos/base-logo.png',
  },
  {
    ...externalRoutes.FRAX_DOCS,
    logo: '/logos/frax-logo.png',
  },
  {
    ...externalRoutes.LISK_DOCS,
    logo: '/logos/lisk-logo.png',
  },
  {
    ...externalRoutes.MODE_DOCS,
    logo: '/logos/mode-logo.png',
  },
  {
    ...externalRoutes.OPTIMISM_DOCS,
    logo: '/logos/opmainnet-logo.png',
  },
  {
    ...externalRoutes.REDSTONE_DOCS,
    logo: '/logos/redstone-logo.png',
  },
  {
    ...externalRoutes.ZORA_DOCS,
    logo: '/logos/zora-logo.png',
  },
]

export { routes, externalRoutes, docsItems, supportItems }
