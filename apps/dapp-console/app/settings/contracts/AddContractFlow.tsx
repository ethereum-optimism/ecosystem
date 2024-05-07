import { AddContractForm } from '@/app/settings/contracts/AddContractForm'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { Contract } from '@/app/types/api'

export type AddContractFlowProps = {
  appId: string
  unverifiedContract?: Contract
  onStartVerification: (contract: Contract) => void
}

export const AddContractFlow = ({
  appId,
  unverifiedContract,
  onStartVerification,
}: AddContractFlowProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">
        {unverifiedContract ? 'Verifiy Contract' : 'Add Contract'}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <AddContractForm
        appId={appId}
        unverifiedContract={unverifiedContract}
        onStartVerification={onStartVerification}
      />
    </CardContent>
  </Card>
)
