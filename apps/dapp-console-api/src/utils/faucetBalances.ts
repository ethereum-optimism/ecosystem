import type { Address } from 'viem'

import type { RedisCache } from './redis'

const getFaucetContractBalanceKey = (address: Address, chainId: number) =>
  `faucet_contract_balance_${chainId}_${address}`

export const getFaucetContractBalance = async ({
  redisCache,
  address,
  chainId,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
}) => redisCache.getItem<bigint>(getFaucetContractBalanceKey(address, chainId))

const getFaucetAdminWalletBalanceKey = (address: Address, chainId: number) =>
  `faucet_admin_wallet_balance_${chainId}_${address}`

export const getFaucetAdminWalletBalance = async ({
  redisCache,
  address,
  chainId,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
}) =>
  redisCache.getItem<bigint>(getFaucetAdminWalletBalanceKey(address, chainId))
