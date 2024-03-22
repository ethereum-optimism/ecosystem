import { MouseEventHandler, useCallback, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components'

import { deploymentRebateM2Metadata } from '@/app/console/constants'
import { StandardDialogContent } from '@/app/components/StandardDialogContent'

export type RebateDialogProps = {
  children: React.ReactNode
}

export const RebateDialog = ({ children }: RebateDialogProps) => {
  const [isOpen, setOpen] = useState(false)

  // The click on "Add Contracts" is a noop on the settings page, but not on the homepage
  const onHandleClick = useCallback(
    (e) => {
      const node = document.querySelector('#deployment-rebate-add-contracts')
      if (node?.contains(e.target as Node)) {
        setOpen(false)
      }
    },
    [setOpen],
  ) as MouseEventHandler<HTMLDivElement>

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent onClick={onHandleClick}>
        <StandardDialogContent dialogMetadata={deploymentRebateM2Metadata} />
      </DialogContent>
    </Dialog>
  )
}
