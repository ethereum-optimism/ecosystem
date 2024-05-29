import type { Address } from 'viem'

import type { RedisCache } from './redis'

const getFaucetContractBalanceKey = (address: Address, chainId: number) =>
  `faucet_contract_balance_${chainId}_${address}`

export const updateFaucetContractBalance = async ({
  redisCache,
  address,
  chainId,
  balance,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
  balance: bigint
}) =>
  redisCache.setItem({
    key: getFaucetContractBalanceKey(address, chainId),
    value: balance,
  })

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

export const updateFaucetAdminWalletBalance = async ({
  redisCache,
  address,
  chainId,
  balance,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
  balance: bigint
}) =>
  redisCache.setItem({
    key: getFaucetAdminWalletBalanceKey(address, chainId),
    value: balance,
  })

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

const getDrippieContractBalanceKey = (address: Address, chainId: number) =>
  `faucet_drippie_balance_${chainId}_${address}`

export const updateDrippieContractBalance = async ({
  redisCache,
  address,
  chainId,
  balance,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
  balance: bigint
}) =>
  redisCache.setItem({
    key: getDrippieContractBalanceKey(address, chainId),
    value: balance,
  })

export const getDrippieContractBalance = async ({
  redisCache,
  address,
  chainId,
}: {
  redisCache: RedisCache
  address: Address
  chainId: number
}) => redisCache.getItem<bigint>(getDrippieContractBalanceKey(address, chainId))
