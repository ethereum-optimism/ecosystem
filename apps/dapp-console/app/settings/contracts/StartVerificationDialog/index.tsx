import { Contract } from '@/app/types/api'
import {
  ContractVerificationProvider,
  ContractVerificationStep,
  useContractVerification,
} from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { BeginContent } from '@/app/settings/contracts/StartVerificationDialog/BeginContent'
import { StartVerificationContent } from '@/app/settings/contracts/StartVerificationDialog/StartVerificationContent'
import { FinishVerificationContent } from '@/app/settings/contracts/StartVerificationDialog/FinishVerificationContent'
import { VerifiedContent } from '@/app/settings/contracts/StartVerificationDialog/VerifiedContent'
import { Dialog, DialogContent } from '@eth-optimism/ui-components'
import { useMemo } from 'react'

export type StartVerificationDialogProps = {
  initialStep: ContractVerificationStep
  contract: Contract
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  onContractVerified: (contract: Contract) => void
}

const dialogContentMap: Record<ContractVerificationStep, React.ReactNode> = {
  begin: <BeginContent />,
  'start-verification': <StartVerificationContent />,
  'finish-verification': <FinishVerificationContent />,
  verified: <VerifiedContent />,
}

export const StartVerificationDialogContent = () => {
  const { step } = useContractVerification()

  const content = useMemo(() => dialogContentMap[step], [step])

  // We preventDefault inside of onInteractOutside to prevent the dialog from closing while interacting with your wallet
  return (
    <DialogContent onInteractOutside={(e: Event) => e.preventDefault()}>
      {content}
    </DialogContent>
  )
}

export const StartVerificationDialog = ({
  contract,
  initialStep,
  open,
  onOpenChange,
  onContractVerified,
}: StartVerificationDialogProps) => (
  <ContractVerificationProvider
    contract={contract}
    initialStep={initialStep}
    onContractVerified={onContractVerified}
  >
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <StartVerificationDialogContent />
    </Dialog>
  </ContractVerificationProvider>
)
