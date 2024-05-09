import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import { Contract } from '@/app/types/api'
import { shortenAddress } from '@eth-optimism/op-app'
import { Dialog, DialogContent, toast } from '@eth-optimism/ui-components'
import { useCallback, useState } from 'react'
import { DialogContractContent } from '@/app/settings/contracts/DeleteContractDialog/DeleteContractContent'
import { SuccessContent } from '@/app/settings/contracts/DeleteContractDialog/SuccessContent'
import { LONG_DURATION } from '@/app/constants/toast'
import { trackDeleteActionConfirm } from '@/app/event-tracking/mixpanel'

export type DeleteContractDialogProps = {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  contract: Contract
}

export const DeleteContractDialog = ({
  contract,
  open,
  onOpenChange,
}: DeleteContractDialogProps) => {
  const [step, setStep] = useState<'delete' | 'success'>('delete')

  const { mutateAsync: deleteContract, isLoading: isLoadingDeleteContract } =
    apiClient.Contracts.deleteContract.useMutation()
  const apiUtils = apiClient.useUtils()

  const handleDelete = useCallback(async () => {
    if (isLoadingDeleteContract) {
      return
    }

    try {
      await deleteContract({ contractId: contract.id })
      await apiUtils.apps.listApps.invalidate()

      toast({
        description: `Successfully deleted ${shortenAddress(contract.contractAddress)}`,
        duration: LONG_DURATION,
      })

      trackDeleteActionConfirm('contract')
      setStep('success')
    } catch (e) {
      captureError(e, 'deleteContract')
    }
  }, [apiUtils, contract, deleteContract, isLoadingDeleteContract])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center text-center">
        {step === 'delete' ? (
          <DialogContractContent
            contract={contract}
            onDeleteContract={handleDelete}
            onCancel={handleCancel}
            isLoading={isLoadingDeleteContract}
          />
        ) : (
          <SuccessContent onClose={handleCancel} />
        )}
      </DialogContent>
    </Dialog>
  )
}
