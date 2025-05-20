import type { Network } from '@eth-optimism/viem/chains'
import { AlertTriangle } from 'lucide-react'

import { NetworkPicker } from '@/components/NetworkPicker'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useConfig } from '@/stores/useConfig'

export const AvailableNetworks = ({
  requiredNetworks,
}: {
  requiredNetworks: Network[]
}) => {
  const { networkName } = useConfig()

  if (requiredNetworks.map((network) => network.name).includes(networkName)) {
    return null
  }

  const networkNames = requiredNetworks
    .map((network) => network.name)
    .join(', ')

  return (
    <Alert variant="destructive" className="space-y-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5" />
        <div>
          <AlertTitle>Unsupported Network</AlertTitle>
          <AlertDescription>
            This feature is only available on: {networkNames}
          </AlertDescription>
        </div>
      </div>
      <div className="text-foreground">
        <NetworkPicker
          allowedNetworkNames={requiredNetworks.map((network) => network.name)}
        />
      </div>
    </Alert>
  )
}
