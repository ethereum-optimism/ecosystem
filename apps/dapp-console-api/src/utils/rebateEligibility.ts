import type { ContractWithTxRebateAndEntity } from '@/models'

export const addRebateEligibilityToContract = (
  contract: ContractWithTxRebateAndEntity,
) => {
  return {
    ...contract,
    isEligibleForRebate: isContractDeploymentDateEligibleForRebate(contract),
  }
}

export const isContractDeploymentDateEligibleForRebate = (
  contract: ContractWithTxRebateAndEntity,
) => {
  return (
    contract.transaction &&
    contract.entity?.privyCreatedAt &&
    contract.transaction.blockTimestamp >
      Math.floor(contract.entity.privyCreatedAt.getTime() / 1000)
  )
}
