import { Badge } from '@eth-optimism/ui-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { ClaimRebateDialog } from '@/app/settings/components/ClaimRebateDialog'
import { Contract } from '@/app/types/api'

export type EligibleForRebateBadgeProps = {
  contract: Contract
}

export const EligibleForRebateBadge = ({
  contract,
}: EligibleForRebateBadgeProps) => (
  <ClaimRebateDialog contract={contract}>
    <Badge className="pr-1 max-h-[22px] cursor-pointer" variant="success">
      Eligible for rebate <RiArrowRightSLine size={16} className="mt-0.5" />
    </Badge>
  </ClaimRebateDialog>
)
