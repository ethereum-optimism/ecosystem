import { getAddress } from 'viem'

import type {
  ContractWithTxRebateAndEntity,
  DeploymentRebate,
  Entity,
  Transaction,
  Wallet,
} from '@/models'
import {
  ContractState,
  DeploymentRebateState,
  EntityState,
  TransactionEvent,
  WalletLinkType,
  WalletState,
} from '@/models'
import { getRandomAddress } from '@/testUtils/getRandomAddress'

export const ENTITY_ID = 'id1'
export const PRIVY_DID = 'privy:did'
export const CONTRACT_ID = 'contractId1'
export const TRANSACTION_ID = 'txId1'
export const DEPLOYMENT_REBATE_ID = 'deploymentRebateId1'
export const CONTRACT_ADDRESS = getRandomAddress()
export const DEPLOYER_ADDRESS = getRandomAddress()
export const DEPLOYMENT_TX_HASH =
  '0x12bfde21d9da97cd69cbb013f20628d00737778f3cf4374679afdbdf91484e0d'
export const CREATION_DATE = new Date('05/05/2024')
export const CB_VERIFIED_WALLET: Wallet = {
  createdAt: CREATION_DATE,
  updatedAt: CREATION_DATE,
  id: 'walletId1',
  state: WalletState.ACTIVE,
  disabledAt: null,
  entityId: ENTITY_ID,
  address: getRandomAddress(),
  linkType: WalletLinkType.PRIVY,
  verifications: { isCbVerified: true },
  unlinkedAt: null,
  sanctionedAt: null,
}
export const WALLET_VERIFICATIONS = {
  cbVerifiedWallets: [CB_VERIFIED_WALLET],
}

export const ACTIVE_ENTITY: Entity = {
  createdAt: CREATION_DATE,
  id: ENTITY_ID,
  privyDid: PRIVY_DID,
  privyCreatedAt: CREATION_DATE,
  state: EntityState.ACTIVE,
  updatedAt: CREATION_DATE,
  disabledAt: null,
  sanctionInfo: null,
}

export const DEPLOYMENT_TRANSACTION: Transaction = {
  id: TRANSACTION_ID,
  createdAt: CREATION_DATE,
  updatedAt: CREATION_DATE,
  entityId: ENTITY_ID,
  contractId: CONTRACT_ID,
  chainId: 10,
  contractAddress: CONTRACT_ADDRESS,
  transactionHash: DEPLOYMENT_TX_HASH,
  status: 'success',
  value: null,
  blockNumber: '120365513',
  blockTimestamp: Math.floor(new Date('05/06/2024').getTime() / 1000),
  fromAddress: DEPLOYER_ADDRESS,
  toAddress: null,
  gasUsed: '181089',
  gasPrice: '62241616',
  blobGasPrice: null,
  blobGasUsed: null,
  transactionType: 'eip4844',
  transactionEvent: TransactionEvent.CONTRACT_DEPLOYMENT,
  maxFeePerBlobGas: null,
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
}

export const VERIFIED_CONTRACT: ContractWithTxRebateAndEntity = {
  createdAt: CREATION_DATE,
  updatedAt: CREATION_DATE,
  id: CONTRACT_ID,
  name: null,
  state: ContractState.VERIFIED,
  entityId: ENTITY_ID,
  chainId: 10,
  appId: 'appId1',
  contractAddress: CONTRACT_ADDRESS,
  deployerAddress: DEPLOYER_ADDRESS,
  deploymentTxHash: DEPLOYMENT_TX_HASH,
  transaction: DEPLOYMENT_TRANSACTION,
  entity: ACTIVE_ENTITY,
  deploymentRebate: null,
}

export const DEPLOYMENT_REBATE: DeploymentRebate = {
  id: DEPLOYMENT_REBATE_ID,
  entityId: ENTITY_ID,
  contractId: CONTRACT_ID,
  contractAddress: CONTRACT_ADDRESS,
  deploymentTxHash: DEPLOYMENT_TX_HASH,
  chainId: 10,
  state: DeploymentRebateState.PENDING_SEND,
  recipientAddress: DEPLOYER_ADDRESS,
  verifiedWallets: [getAddress(CB_VERIFIED_WALLET.address)],
  createdAt: CREATION_DATE,
  updatedAt: CREATION_DATE,
  rejectionReason: null,
  rebateTxHash: null,
  rebateAmount: null,
  rebateTxTimestamp: null,
}
