import type { ContractWithTxAndEntity } from '@/models'

export const addRebateEligibilityToContract = (
  contract: ContractWithTxAndEntity,
) => {
  return {
    ...contract,
    isEligibleForRebate: isContractDeploymentDateEligibleForRebate(contract),
  }
}

export const isContractDeploymentDateEligibleForRebate = (
  contract: ContractWithTxAndEntity,
) => {
  return (
    contract.transaction &&
    contract.entity &&
    contract.transaction.blockTimestamp >
      Math.floor(contract.entity.createdAt.getTime() / 1000)
  )
}
