import { Address, Hash } from 'viem'

export type DeployedApp = {
  contracts: Contract[]
  chainId: number | null
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  state: 'active' | 'disabled'
  entityId: string
}

export type Contract = {
  chainId: number
  name: string | null
  id: string
  contractAddress: Address
  createdAt: Date
  updatedAt: Date
  state: 'not_verified' | 'verified'
  entityId: string
  appId: string
  deployerAddress: Address
  deploymentTxHash: Hash
}

export type Challenge = {
  challenge: string
  chainId: number
  id: string
  address: Address
  createdAt: Date
  updatedAt: Date
  state: 'pending' | 'verified' | 'expired'
  entityId: string
  contractId: string
}
