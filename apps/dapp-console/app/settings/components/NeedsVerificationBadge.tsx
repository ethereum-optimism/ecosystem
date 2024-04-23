import { Badge } from '@eth-optimism/ui-components'
import { RiArrowRightSLine } from '@remixicon/react'

export type NeedsVerificationBadgeProps = {
  onClick: () => void
}

export const NeedsVerificationBadge = ({
  onClick,
}: NeedsVerificationBadgeProps) => (
  <Badge
    className="pr-1 max-h-[22px] cursor-pointer"
    variant="secondary"
    onClick={onClick}
  >
    Needs verification <RiArrowRightSLine size={16} className="mt-0.5" />
  </Badge>
)
