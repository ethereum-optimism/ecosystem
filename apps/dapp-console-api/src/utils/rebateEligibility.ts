import type { Contract, DeploymentRebate, Transaction } from '@/models'

type ContractWithDeploymentRebateAndDeploymentTx = Contract & {
  transaction: Transaction | null
} & { deploymentRebate: DeploymentRebate | null }

export const addRebateEligibilityToContract = (
  contract: ContractWithDeploymentRebateAndDeploymentTx,
  privyUserCreatedAt: Date,
) => {
  return {
    ...contract,
    isEligibleForRebate: isContractDeploymentDateEligibleForRebate(
      contract,
      privyUserCreatedAt,
    ),
  }
}

export const isContractDeploymentDateEligibleForRebate = (
  contract: ContractWithDeploymentRebateAndDeploymentTx,
  privyUserCreatedAt: Date,
) => {
  return (
    contract.transaction &&
    contract.transaction.blockTimestamp >
      Math.floor(privyUserCreatedAt.getTime() / 1000)
  )
}
