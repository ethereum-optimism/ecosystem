import { Address, Hex } from 'viem'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

export const getSmartAccountTransactionKey = (
  chainId: number,
  accountAddress: Address,
) => {
  return `${accountAddress}-${chainId}`
}

interface SmartAccountTransactionHashesState {
  transactionHashesByAddressChainId: Record<string, Hex[]>
  add: ({
    address,
    chainId,
    transactionHash,
  }: {
    address: Address
    chainId: number
    transactionHash: Hex
  }) => void
}

// Local storage based cache for recent transactions
export const useSmartAccountTransactionHashes =
  create<SmartAccountTransactionHashesState>()(
    persist(
      (set) => ({
        transactionHashesByAddressChainId: {},
        add: ({ chainId, address, transactionHash }) =>
          set((state) =>
            produce(state, (draft) => {
              const key = getSmartAccountTransactionKey(chainId, address)
              if (!draft.transactionHashesByAddressChainId[key]) {
                draft.transactionHashesByAddressChainId[key] = [transactionHash]
                return
              }
              draft.transactionHashesByAddressChainId[key].unshift(
                transactionHash,
              )
            }),
          ),
      }),
      {
        name: 'user-op-transaction-hash-store',
      },
    ),
  )
