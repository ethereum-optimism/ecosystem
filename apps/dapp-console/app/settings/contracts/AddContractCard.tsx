import { AddContractForm } from '@/app/settings/contracts/AddContractForm'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { useCallback, useState } from 'react'
import {
  StartVerificationDialog,
  StartVerificationDialogStep,
} from '@/app/settings/contracts/StartVerificationDialog'

export type AddContractCardProps = {
  appId: string
}

export const AddContractCard = ({ appId }: AddContractCardProps) => {
  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [verifyStep, setVerifyStep] =
    useState<StartVerificationDialogStep>('begin')

  const handleStartVerification = useCallback(
    (isVerified: boolean) => {
      setVerifyStep(isVerified ? 'verified' : 'begin')
      setVerifyDialogOpen(true)
    },
    [setVerifyDialogOpen, setVerifyStep],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Contract</CardTitle>
      </CardHeader>
      <CardContent>
        <AddContractForm
          appId={appId}
          onStartVerification={handleStartVerification}
        />
        <StartVerificationDialog
          contractAddress="0x3065b9bd9250Be77D821EdcB3ec46B273f3BA64d"
          initialStep={verifyStep}
          open={isVerifyDialogOpen}
          onOpenChange={setVerifyDialogOpen}
        />
      </CardContent>
    </Card>
  )
}
