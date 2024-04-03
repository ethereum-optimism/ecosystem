import type { KVNamespace } from '@cloudflare/workers-types'

export type Env = {
  ENVIRONMENT: 'DEV' | 'PROD'
  NEYNAR_API_KEY: string
  SEPOLIA_JSON_RPC_URL: string
  OP_SEPOLIA_JSON_RPC_URL: string
  BASE_SEPOLIA_JSON_RPC_URL: string
  ZORA_SEPOLIA_JSON_RPC_URL: string
  MAINNET_JSON_RPC_URL: string
  BASE_JSON_RPC_URL: string
  FRAXTAL_JSON_RPC_URL: string
  OP_MAINNET_JSON_RPC_URL: string
  MODE_JSON_RPC_URL: string
  ZORA_JSON_RPC_URL: string
  KV: KVNamespace
}
