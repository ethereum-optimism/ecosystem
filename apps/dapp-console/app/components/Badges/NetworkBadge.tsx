import { Badge } from '@eth-optimism/ui-components'
import { Network } from '@/app/components/Network'

export type NetworkBadgeProps = {
  chainId: number
}

export const NetworkBadge = ({ chainId }: NetworkBadgeProps) => (
  <Badge variant="secondary">
    <Network chainId={chainId} size={16} />
  </Badge>
)
