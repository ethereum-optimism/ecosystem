import type { PrivyClient, WalletWithMetadata } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type { Database } from '@/db'
import { syncPrivyWallets } from '@/models'

const fetchLinkedWallets = async (
  privyClient: PrivyClient,
  privyDid: string,
) => {
  const user = await privyClient.getUser(privyDid)
  const wallets = user.linkedAccounts.filter(
    (account) => account.type === 'wallet',
  ) as WalletWithMetadata[]
  return wallets.map((wallet) => wallet.address as Address)
}

export const fetchAndSyncPrivyWallets = async (
  db: Database,
  privyClient: PrivyClient,
  privyDid: string,
  entityId: string,
) => {
  const privyLinkedWallets = await fetchLinkedWallets(privyClient, privyDid)
  return syncPrivyWallets(db, entityId, privyLinkedWallets)
}
