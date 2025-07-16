import type { GetAllWalletsOptions, Wallet } from '@eth-optimism/verbs-sdk'

import { getVerbs } from '../config/verbs.js'

export async function createWallet(userId: string): Promise<Wallet> {
  const verbs = getVerbs()
  return await verbs.createWallet(userId)
}

export async function getWallet(userId: string): Promise<Wallet | null> {
  const verbs = getVerbs()
  return await verbs.getWallet(userId)
}

export async function getAllWallets(
  options?: GetAllWalletsOptions,
): Promise<Wallet[]> {
  const verbs = getVerbs()
  return await verbs.getAllWallets(options)
}

export async function getOrCreateWallet(userId: string): Promise<Wallet> {
  let wallet = await getWallet(userId)
  if (!wallet) {
    wallet = await createWallet(userId)
  }
  return wallet
}
