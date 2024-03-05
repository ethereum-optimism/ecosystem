import { UserOperationRequest } from '@alchemy/aa-core'
import { Address, Hex } from 'viem'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

type UserOperationTransaction = {
  transactionHash: Hex
  userOpHash: Hex
  userOp: UserOperationRequest
  addedAt: number
}

export const getUserOperationTransactionKey = (
  chainId: number,
  accountAddress: Address,
) => {
  return `${accountAddress}-${chainId}`
}

interface UserOperationTransactionsState {
  userOpTransactionByAddressChainId: Record<string, UserOperationTransaction[]>
  add: ({
    chainId,
    userOp,
    transactionHash,
  }: {
    chainId: number
    userOp: UserOperationRequest
    userOpHash: Hex
    transactionHash: Hex
  }) => void
}

// Local storage based cache for recent transactions
export const useUserOperationTransactions =
  create<UserOperationTransactionsState>()(
    persist(
      (set) => ({
        userOpTransactionByAddressChainId: {},
        add: ({ chainId, userOp, userOpHash, transactionHash }) =>
          set((state) =>
            produce(state, (draft) => {
              const key = getUserOperationTransactionKey(chainId, userOp.sender)
              if (!draft.userOpTransactionByAddressChainId[key]) {
                draft.userOpTransactionByAddressChainId[key] = []
              }
              draft.userOpTransactionByAddressChainId[key].push({
                transactionHash: transactionHash,
                userOpHash: userOpHash,
                userOp: userOp,
                addedAt: Date.now(),
              })
            }),
          ),
      }),
      {
        name: 'user-op-transaction-store',
      },
    ),
  )
