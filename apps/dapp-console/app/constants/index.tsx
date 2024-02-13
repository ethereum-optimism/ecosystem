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
  DAPP_EXAPMPLES: {
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

export { routes, externalRoutes }
