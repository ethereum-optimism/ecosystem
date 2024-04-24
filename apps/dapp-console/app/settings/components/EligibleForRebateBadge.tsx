import { Badge } from '@eth-optimism/ui-components'
import { RiArrowRightSLine } from '@remixicon/react'
import { Contract } from '@/app/types/api'

export type EligibleForRebateBadgeProps = {
  contract: Contract
  onStartClaimRebate: (contract: Contract) => void
}

export const EligibleForRebateBadge = ({
  contract,
  onStartClaimRebate,
}: EligibleForRebateBadgeProps) => (
  <Badge
    className="pr-1 max-h-[22px] cursor-pointer"
    variant="success"
    onClick={() => onStartClaimRebate(contract)}
  >
    Eligible for rebate <RiArrowRightSLine size={16} className="mt-0.5" />
  </Badge>
)
