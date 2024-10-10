import type { Address, Chain, Hex } from 'viem'
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  fallback,
  http,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  baseSepolia,
  modeTestnet,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'

import { envVars } from '../constants'

type FaucetConfig = {
  // The chain id of the faucet (e.g. 420)
  id: number
  // Display name of the faucet in the UI (e.g. OP Goerli)
  displayName: string
  chain: Chain
  // The amount of eth distributed for on-chain auth methods.
  onChainDripAmount: bigint
  // The amount of eth distributed for on-chain auth methods.
  offChainDripAmount: bigint
  // Environment that the faucet is supported in.
  supportedEnvironments: Array<typeof envVars.DEPLOYMENT_ENV>
  l1BridgeAddress?: Address
  isL1Faucet?: boolean
}

const DEFAULT_ON_CHAIN_DRIP_AMOUNT = parseEther('1.0')
const DEFAULT_OFF_CHAIN_DRIP_AMOUNT = parseEther('0.05')

const faucetConfigs: FaucetConfig[] = [
  {
    id: sepolia.id,
    displayName: 'Ethereum Sepolia',
    chain: sepolia,
    isL1Faucet: true,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
  },
  {
    id: baseSepolia.id,
    displayName: 'Base Sepolia',
    chain: baseSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
  },
  {
    id: 4202,
    displayName: 'Lisk Sepolia',
    chain: defineChain({
      id: 4202,
      name: 'Lisk Sepolia',
      network: 'lisk-sepolia',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://rpc.sepolia-api.lisk.com'],
        },
        public: {
          http: ['https://rpc.sepolia-api.lisk.com'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Blockscout',
          url: 'https://sepolia-blockscout.lisk.com',
        },
      },
    }),
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0x1Fb30e446eA791cd1f011675E5F3f5311b70faF5',
  },
  {
    id: modeTestnet.id,
    displayName: 'Mode Sepolia',
    chain: modeTestnet,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0xbC5C679879B2965296756CD959C3C739769995E2',
  },
  {
    id: optimismSepolia.id,
    displayName: 'OP Sepolia',
    chain: optimismSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
  },
  {
    id: zoraSepolia.id,
    displayName: 'Zora Sepolia',
    chain: zoraSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB',
  },
  {
    id: 111557560,
    displayName: 'Cyber Sepolia',
    chain: defineChain({
      id: 111557560,
      name: 'Cyber Sepolia',
      network: 'cyber-sepolia',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://cyber-testnet.alt.technology'],
        },
        public: {
          http: ['https://cyber-testnet.alt.technology'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Hemera',
          url: 'https://testnet.cyberscan.co/',
        },
      },
    }),
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0xAA1bD6D4d8cFD37330a917bc678CB38BEFAf44E6',
  },
  {
    id: 1740,
    displayName: 'Metal Sepolia',
    chain: defineChain({
      id: 1740,
      name: 'Metal Sepolia',
      network: 'metal-sepolia',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://testnet.rpc.metall2.com'],
        },
        public: {
          http: ['https://testnet.rpc.metall2.com'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Blockscout',
          url: 'https://testnet.explorer.metall2.com',
        },
      },
    }),
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0x21530aAdF4DCFb9c477171400E40d4ef615868BE',
  },
  {
    id: 1301,
    displayName: 'Unichain Sepolia',
    chain: defineChain({
      id: 1301,
      name: 'Unichain Sepolia',
      network: 'unichain-sepolia',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://sepolia.unichain.org'],
        },
        public: {
          http: ['https://sepolia.unichain.org'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Blockscout',
          url: 'https://unichain-sepolia.blockscout.com/',
        },
      },
    }),
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    l1BridgeAddress: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
  },
]

export const supportedFaucetConfigs = faucetConfigs.filter((faucet) =>
  faucet.supportedEnvironments.includes(envVars.DEPLOYMENT_ENV),
)

const getSepoliaConfig = () => {
  const sepoliaConfig = faucetConfigs.find(
    (config) => config.displayName === 'Ethereum Sepolia',
  )
  if (!sepoliaConfig) {
    throw new Error('Sepolia configuration not found')
  }
  return sepoliaConfig
}

export const sepoliaPublicClient = createPublicClient({
  chain: getSepoliaConfig().chain,
  transport: fallback(envVars.JSON_RPC_URLS_L1_SEPOLIA.map((url) => http(url))),
})

export const sepoliaAdminWalletClient = createWalletClient({
  account: privateKeyToAccount(
    envVars.FAUCET_AUTH_ADMIN_WALLET_PRIVATE_KEY as Hex,
  ),
  chain: getSepoliaConfig().chain,
  transport: fallback(envVars.JSON_RPC_URLS_L1_SEPOLIA.map((url) => http(url))),
})
