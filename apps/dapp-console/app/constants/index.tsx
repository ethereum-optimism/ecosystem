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
    path: '',
    label: 'Developer Forum',
  },
  FARCASTER: {
    path: '',
    label: 'Farcaster',
  },
  DISCORD: {
    path: '',
    label: 'Discord',
  },
  DAPP_EXAPMPLES: {
    path: '',
    label: 'Dapp Examples',
  },
  // Documentation items
  ETH_DOCS: {
    path: '',
    label: 'Ethereum',
  },
  BASE_DOCS: {
    path: '',
    label: 'Base',
  },
  FRAX_DOCS: {
    path: '',
    label: 'Fraxtal',
  },
  LISK_DOCS: {
    path: '',
    label: 'Lisk',
  },
  MODE_DOCS: {
    path: '',
    label: 'Mode',
  },
  OPTIMISM_DOCS: {
    path: '',
    label: 'Optimism',
  },
  REDSTONE_DOCS: {
    path: '',
    label: 'Redstone',
  },
  ZORA_DOCS: {
    path: '',
    label: 'Zora',
  },
}

export { routes, externalRoutes }
