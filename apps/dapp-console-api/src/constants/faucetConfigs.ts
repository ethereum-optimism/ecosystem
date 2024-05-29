import type { Address, Chain, Hex } from 'viem'
import { defineChain, parseEther } from 'viem'
import { createPublicClient, createWalletClient, fallback, http } from 'viem'
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
  onChainModuleAddress: Address
  offChainModuleAddress: Address
}

// Configs for the Drippie contracts that help keep the faucet contract and admin wallets funded.
type DrippieConfig = {
  // Rpc urls for the chain the faucet is on.
  rpcUrls: string[]
  // Chain that the Drippie contract is deployed on.
  chain: Chain
  // Environment that the faucet is supported in.
  supportedEnvironments: Array<typeof envVars.DEPLOYMENT_ENV>
}

const DEFAULT_ON_CHAIN_DRIP_AMOUNT = parseEther('1.0')
const DEFAULT_OFF_CHAIN_DRIP_AMOUNT = parseEther('0.05')

const faucetConfigs: FaucetConfig[] = [
  {
    id: sepolia.id,
    displayName: 'Ethereum Sepolia',
    chain: sepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x1D5BF457f5cC5095DD693b023Fe09969BD8E2483',
    offChainModuleAddress: '0xf9fE0495344e68eEBC23eD23f31C82Fa88a1179B',
  },
  {
    id: baseSepolia.id,
    displayName: 'Base Sepolia',
    chain: baseSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x6d08Ad4Ba49b43cC44013da3C8a2F0ABD396B35D',
    offChainModuleAddress: '0x9DA2873B5fFe73d3bA353111920534f30076cBb4',
  },
  {
    id: 2523,
    displayName: 'Fraxtal Sepolia',
    chain: defineChain({
      id: 2523,
      name: 'Fraxtal Sepolia',
      network: 'fraxtal-sepolia',
      nativeCurrency: { name: 'Frax Ether', symbol: 'frxETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['https://rpc.testnet-sepolia.frax.com'],
        },
        public: {
          http: ['https://rpc.testnet-sepolia.frax.com'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Explorer',
          url: 'https://explorer.testnet-sepolia.frax.com',
        },
      },
    }),
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x1D5BF457f5cC5095DD693b023Fe09969BD8E2483',
    offChainModuleAddress: '0xf9fE0495344e68eEBC23eD23f31C82Fa88a1179B',
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
    onChainModuleAddress: '0x1D5BF457f5cC5095DD693b023Fe09969BD8E2483',
    offChainModuleAddress: '0xf9fE0495344e68eEBC23eD23f31C82Fa88a1179B',
  },
  {
    id: modeTestnet.id,
    displayName: 'Mode Sepolia',
    chain: modeTestnet,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x6d08Ad4Ba49b43cC44013da3C8a2F0ABD396B35D',
    offChainModuleAddress: '0x9DA2873B5fFe73d3bA353111920534f30076cBb4',
  },
  {
    id: optimismSepolia.id,
    displayName: 'OP Sepolia',
    chain: optimismSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x6d08Ad4Ba49b43cC44013da3C8a2F0ABD396B35D',
    offChainModuleAddress: '0x9DA2873B5fFe73d3bA353111920534f30076cBb4',
  },
  {
    id: zoraSepolia.id,
    displayName: 'Zora Sepolia',
    chain: zoraSepolia,
    onChainDripAmount: DEFAULT_ON_CHAIN_DRIP_AMOUNT,
    offChainDripAmount: DEFAULT_OFF_CHAIN_DRIP_AMOUNT,
    supportedEnvironments: ['production', 'staging', 'development'],
    onChainModuleAddress: '0x6d08Ad4Ba49b43cC44013da3C8a2F0ABD396B35D',
    offChainModuleAddress: '0x9DA2873B5fFe73d3bA353111920534f30076cBb4',
  },
]

const faucetDrippieConfigs: DrippieConfig[] = [
  {
    chain: sepolia,
    rpcUrls: envVars.JSON_RPC_URLS_L1_SEPOLIA,
    supportedEnvironments: ['production', 'staging'],
  },
]

export const supportedFaucetConfigs = faucetConfigs.filter((faucet) =>
  faucet.supportedEnvironments.includes(envVars.DEPLOYMENT_ENV),
)

export const supportedDrippieConfigs = faucetDrippieConfigs.filter((drippie) =>
  drippie.supportedEnvironments.includes(envVars.DEPLOYMENT_ENV),
)

export const ONCE_UPON_BASE_URL = 'https://www.onceupon.gg'

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
    envVars.FAUCET_V1_AUTH_ADMIN_WALLET_PRIVATE_KEY as Hex,
  ),
  chain: getSepoliaConfig().chain,
  transport: fallback(envVars.JSON_RPC_URLS_L1_SEPOLIA.map((url) => http(url))),
})
