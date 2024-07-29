export type Route = {
  path: string
  label: string
}

export type Routes = Record<string, Route>

export const routes: Routes = {
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

export const externalRoutes: Routes = {
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
    label: 'App Examples',
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
    path: 'https://docs.frax.com/fraxtal',
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
    label: 'OP Mainnet',
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
    path: 'https://app.optimism.io/retropgf',
    label: 'Retro Funding',
  },

  // Misc links
  SUPERCHAIN: {
    path: 'https://optimism.io/superchain',
    label: 'Superchain',
  },
  TERMS: {
    path: 'https://optimism.io/terms',
    label: 'Terms',
  },
  COMMUNITY_AGREEMENT: {
    path: 'https://optimism.io/community-agreement',
    label: 'Community Agreement',
  },
  REBATE_LEARN_MORE: {
    path: 'https://docs.optimism.io/builders/app-developers/tutorials/deploy-for-free',
    label: 'Learn More',
  },

  // Build links
  TESTNET_PAYMASTER_GITHUB: {
    path: 'https://github.com/ethereum-optimism/ecosystem/tree/main/docs/superchain-paymaster',
    label: 'Testnet paymaster',
  },
  LEARN_ABOUT_PAYMASTER: {
    path: 'https://superchain-paymaster-nft-mint-example.pages.dev/',
    label: 'Learn about paymasters',
  },
  SUPERCHAIN_SAFE_OP: {
    path: 'https://safe.optimism.io/welcome',
    label: 'Superchain Safe',
  },
  SUPERCHAIN_SAFE_OTHER: {
    path: 'https://app.safe.global/welcome/accounts',
    label: 'Superchain Safe',
  },
  QUICK_START: {
    path: 'https://docs.optimism.io/builders/dapp-developers/quick-start',
    label: 'Quick Start',
  },

  // Promo links
  ALCHEMY_LEARN_MORE: {
    path: 'https://www.alchemy.com/',
    label: 'Learn about Alchemy',
  },
  ALCHEMY_SUBGRAPHS_LEARN_MORE: {
    path: 'https://www.alchemy.com/subgraphs',
    label: 'Learn about Subgraphs',
  },
  THIRDWEB_LEARN_MORE: {
    path: 'https://thirdweb.com/community/startup-program',
    label: 'Learn more',
  },
  GELATO_LEARN_MORE: {
    path: 'https://docs.google.com/document/d/1ewcG2FIjSwhWlgXngaKJm2J955_bjVZ9PHhuyi19uuQ',
    label: 'Learn more',
  },
  QUICKNODE_LEARN_MORE: {
    path: 'https://quicknode.notion.site/OP-Labs-x-QuickNode-f11ee23df47b4107a70c5cbfcb0b1e38',
    label: 'Learn more',
  },
  SPEARBIT_LEARN_MORE: {
    path: 'https://spearbit.com/branding',
    label: 'Learn more',
  },
  TURNKEY_INFO_FORM: {
    path: 'https://docs.google.com/forms/d/e/1FAIpQLSflGrDPIrp-ME7LJIRZlyU0WDiX0QXscwoPM0GcGP5LD4QNGA/viewform',
    label: 'Submit account details',
  },
}

export const forms = {
  CONTACT_US: 'https://share.hsforms.com/1fvxLHGW9TQuxdGCmgSlRRgqoshb',
  UX_REVIEW_TESTNET: 'https://share.hsforms.com/1bPQi4dwCTEGafybJi6yv8Aqoshb',
  MAINNET_PAYMASTER: 'https://share.hsforms.com/1cbNWGorjSR2Dn_QLC-lHogqoshb',
  MEGAPHONE: 'https://share.hsforms.com/1XHQ9Io_lT0-vf9nSVoUahQqoshb',
  USER_FEEDBACK_MAINNET:
    'https://share.hsforms.com/1nKIdgLNpQeqsocMP2qMrXAqoshb',
  ALCHEMY_GROWTH:
    'https://alchemyapi.typeform.com/to/Ka0tJ3oT?typeform-source=www.console.optimism.io',
  ALCHEMY_SUBGRAPHS:
    'https://alchemyapi.typeform.com/to/vJAnlTwy?typeform-source=www.console.optimism.io',
  THIRDWEB: 'https://share.hsforms.com/1WCgMOvmuQqmCjdEqtu1NdAea58c',
  GELATO: 'https://share-eu1.hsforms.com/1kaQ2KRLYRym3mZNOF2aEVQ2bmmck',
  QUICKNODE: 'https://quiknode.typeform.com/to/sWxlcYV4#cd=H7qNVcJb',
  SPEARBIT: 'https://spearbit.com/contact',
  PRIVY: 'https://50fzxaracbi.typeform.com/to/VWlGlNoH',
  BWARE:
    'https://docs.google.com/forms/d/e/1FAIpQLSeV1IELTrzhTEHrsVgiBkHCtLgpAL8tOyI7zgW73XK4FZC27w/viewform',
  SHERLOCK: 'https://audits.sherlock.xyz/request-audit',
  TURNKEY: 'https://app.turnkey.com/dashboard/auth/login?redirect=%2Fwelcome',
}

export const supportItems = [
  externalRoutes.DEV_FORUM,
  externalRoutes.FARCASTER,
  externalRoutes.DISCORD,
  externalRoutes.DAPP_EXAMPLES,
]

export const getDocsItems = (showNewLogo: boolean) => [
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
    logo: showNewLogo
      ? '/logos/new-op-mainnet-logo.svg'
      : '/logos/opmainnet-logo.png',
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

export const getSuperchainSafeNetworks = (showNewLogo: boolean) => [
  {
    label: 'Base',
    path: 'https://app.safe.global/welcome/accounts?chain=base',
    logo: '/logos/base-logo.png',
  },
  {
    label: 'Base Sepolia',
    path: 'https://app.safe.global/welcome/accounts?chain=basesep',
    logo: '/logos/base-logo.png',
  },
  {
    label: 'Mode',
    path: 'https://safe.optimism.io/welcome?chain=mode',
    logo: '/logos/mode-logo.png',
  },
  {
    label: 'Mode Sepolia',
    path: 'https://safe.optimism.io/welcome?chain=modeTestnet',
    logo: '/logos/mode-logo.png',
  },
  {
    label: 'OP Mainnet',
    path: 'https://app.safe.global/welcome/accounts?chain=oeth',
    logo: showNewLogo ? '/logos/new-op-mainnet-logo.svg' : '/logos/op-logo.svg',
  },
  {
    label: 'OP Sepolia',
    path: 'https://safe.optimism.io/welcome?chain=opsep',
    logo: showNewLogo ? '/logos/new-op-mainnet-logo.svg' : '/logos/op-logo.svg',
  },
  {
    label: 'Zora',
    path: 'https://safe.optimism.io/welcome?chain=zora',
    logo: '/logos/zora-logo.png',
  },
  {
    label: 'Zora Sepolia',
    path: 'https://safe.optimism.io/welcome?chain=zsep',
    logo: '/logos/zora-logo.png',
  },
  {
    label: 'Lisk (soon)',
    path: null,
    logo: '/logos/lisk-logo.png',
  },
  {
    label: 'Lisk Sepolia',
    path: 'https://safe.optimism.io/welcome?chain=lisksep',
    logo: '/logos/lisk-logo.png',
  },
  {
    label: 'Fraxtal',
    path: 'https://safe.optimism.io/welcome?chain=fraxtal',
    logo: '/logos/frax-logo.png',
  },
  {
    label: 'Testnet (soon)',
    path: null,
    logo: '/logos/frax-logo.png',
  },
]

export const faucetRoutes = {
  SEE_DETAILS_URL: 'TODO',
}
