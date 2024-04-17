import { DeployedApp, Contract } from '@/app/types/api'
import { AddContractFlow } from '@/app/settings/contracts/AddContractFlow'
import { Input } from '@eth-optimism/ui-components'

export type AppContractProps = {
  app: DeployedApp
  contract: Contract
  onStartVerification: (contract: Contract) => void
}

export const DeployedAppContract = ({
  app,
  contract,
  onStartVerification,
}: AppContractProps) => {
  if (contract.state === 'not_verified') {
    return (
      <AddContractFlow
        appId={app.id}
        unverifiedContract={contract}
        onStartVerification={onStartVerification}
      />
    )
  }

  return (
    <div className="flex flex-col">
      <Input value={contract.contractAddress} readOnly />
    </div>
  )
}
