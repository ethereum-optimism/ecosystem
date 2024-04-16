import type { Contract, Transaction } from '@/models'

export const addRebateEligibilityToContract = (
  contract: Contract & { transaction: Transaction | null },
  entityCreatedAt?: Date,
) => {
  return {
    ...contract,
    isEligibleForRebate:
      contract.transaction &&
      entityCreatedAt &&
      contract.transaction.blockTimestamp >
        Math.floor(entityCreatedAt.getTime() / 1000),
  }
}
