import { User } from '@privy-io/react-auth'
import { useCallback, useMemo, useState } from 'react'
import { Transaction } from 'viem'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@eth-optimism/ui-components'

export type IneligibleRebateReason =
  | 'deployed-before-account-creation'
  | 'max-rebate-amount-claimed'

export type IneligibleRebateDialogProps = {
  reason: IneligibleRebateReason
  user: User | null
  contractDeploymentTx?: Transaction & {
    timestamp?: bigint
  }
  children: React.ReactNode
}

const metadata = {
  deployedBeforeAccountCreation: {
    title:
      'This contract was deployed before you signed up to the Dapp Console',
    description:
      'Contract was deployed on {deploy-date}, but you signed up on {signup-date}.',
  },
  maxRebateAmountClaimed: {
    title: 'Max Rebate Amount Claimed Already',
    description: 'You have already claimed the max rebate amount.',
  },
}

export const IneligibleRebateDialog = ({
  reason,
  contractDeploymentTx,
  user,
  children,
}: IneligibleRebateDialogProps) => {
  const [isOpen, setOpen] = useState(false)

  const title = useMemo(() => {
    if (reason === 'max-rebate-amount-claimed') {
      return metadata.maxRebateAmountClaimed.title
    } else {
      return metadata.deployedBeforeAccountCreation.title
    }
  }, [reason])

  const description = useMemo(() => {
    if (reason === 'max-rebate-amount-claimed') {
      return metadata.maxRebateAmountClaimed.description
    } else {
      const signupDate = user?.createdAt.toLocaleString('default', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      return metadata.deployedBeforeAccountCreation.description
        .replace('{signup-date}', signupDate ?? '')
        .replace(
          '{deploy-date}',
          contractDeploymentTx?.timestamp?.toString() ?? 'Feb 25th, 2024',
        )
    }
  }, [user, reason, contractDeploymentTx])

  const handleClose = useCallback(() => setOpen(false), [setOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Text as="p" className="text-lg text-center font-semibold">
            {title}
          </Text>
        </DialogHeader>

        <div className="flex flex-col w-full text-center">
          <Text as="p" className="mt-2">
            {description}
          </Text>

          <Button className="mt-6 h-[48px]" onClick={handleClose}>
            <Text as="span">Close</Text>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
