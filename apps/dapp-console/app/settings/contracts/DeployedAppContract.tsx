import { DeployedApp, Contract } from '@/app/types/api'
import { Button, Input, toast } from '@eth-optimism/ui-components'
import { HexBadge } from '@/app/components/Badges/HexBadge'
import { RiFileCopyLine } from '@remixicon/react'
import { NetworkBadge } from '@/app/components/Badges/NetworkBadge'
import { useCallback, useMemo } from 'react'
import { LONG_DURATION } from '@/app/constants/toast'
import { EligibleForRebateBadge } from '@/app/settings/components/EligibleForRebateBadge'
import { NotEligibleForRebateBadge } from '@/app/settings/components/NotEligibleForRebateBadge'
import { shortenAddress } from '@eth-optimism/op-app'
import { usePrivy } from '@privy-io/react-auth'
import { NeedsVerificationBadge } from '@/app/settings/components/NeedsVerificationBadge'

export type AppContractProps = {
  app: DeployedApp
  contract: Contract
  onStartVerification: (contract: Contract) => void
  onRebateClaimed: (contract: Contract) => void
}

export const DeployedAppContract = ({
  contract,
  onStartVerification,
  onRebateClaimed,
}: AppContractProps) => {
  const { user } = usePrivy()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(contract.contractAddress)

    toast({
      description: 'Contract Address Copied.',
      duration: LONG_DURATION,
    })
  }, [contract])

  const badges = useMemo(() => {
    const items = [
      <NetworkBadge key="network-badge" chainId={contract.chainId} />,
      <HexBadge
        key="deployer-badge"
        label="Deployer"
        value={contract.deployerAddress}
      />,
      <HexBadge key="tx-badge" label="Tx" value={contract.deploymentTxHash} />,
    ]

    if (contract.deploymentRebate) {
      return items
    }

    if (contract.state === 'verified') {
      if (contract.isEligibleForRebate) {
        items.push(
          <EligibleForRebateBadge
            key="rebate-badge"
            contract={contract}
            onRebateClaimed={onRebateClaimed}
          />,
        )
      } else {
        items.push(
          <NotEligibleForRebateBadge
            key="rebate-badge"
            user={user}
            contract={contract}
          />,
        )
      }
    } else if (contract.state === 'not_verified') {
      items.push(
        <NeedsVerificationBadge
          key="needs-verification"
          onClick={() => onStartVerification(contract)}
        />,
      )
    }

    return items
  }, [contract, user, onStartVerification])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-full mr-2">
          <Input
            className="hidden md:flex"
            value={contract.contractAddress}
            readOnly
          />
          <Input
            className="flex md:hidden"
            value={shortenAddress(contract.contractAddress)}
            readOnly
          />

          <div className="flex flex-row flex-wrap w-full gap-2 my-2 items-center">
            {badges}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0"
            aria-label="Copy Contract Address"
            onClick={handleCopy}
          >
            <RiFileCopyLine size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
