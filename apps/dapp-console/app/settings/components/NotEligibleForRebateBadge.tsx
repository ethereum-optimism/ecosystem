import { Badge } from '@eth-optimism/ui-components'
import { RiQuestionFill } from '@remixicon/react'
import { IneligibleRebateDialog } from '@/app/settings/components/IneligibleRebateDialog'
import { User } from '@privy-io/react-auth'
import { Contract } from '@/app/types/api'

export type NotEligibleForRebateBadgeProps = {
  user: User | null
  contract: Contract
}

export const NotEligibleForRebateBadge = ({
  user,
  contract,
}: NotEligibleForRebateBadgeProps) => (
  <IneligibleRebateDialog
    reason="deployed-before-account-creation"
    user={user}
    contract={contract}
  >
    <Badge className="pr-1.5 max-h-[22px] cursor-pointer" variant="secondary">
      Not eligible for rebate <RiQuestionFill size={16} className="ml-0.5" />
    </Badge>
  </IneligibleRebateDialog>
)
