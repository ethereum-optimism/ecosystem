import { Badge } from '@eth-optimism/ui-components'
import { RiCheckLine } from '@remixicon/react'

export const CoinbaseVerificationBadge = () => (
  <Badge className="self-start max-h-[22px] mt-2 grow-0" variant="secondary">
    <RiCheckLine size={16} className="mr-1" /> Coinbase Verification
  </Badge>
)
