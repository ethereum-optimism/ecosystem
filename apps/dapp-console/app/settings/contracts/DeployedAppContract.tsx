import { DeployedApp, Contract } from '@/app/types/api'
import { Button, Input, toast } from '@eth-optimism/ui-components'
import { HexBadge } from '@/app/components/Badges/HexBadge'
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiCloseLine,
  RiFileCopyLine,
} from '@remixicon/react'
import { NetworkBadge } from '@/app/components/Badges/NetworkBadge'
import { useCallback, useMemo } from 'react'
import { LONG_DURATION } from '@/app/constants/toast'
import { EligibleForRebateBadge } from '@/app/settings/components/EligibleForRebateBadge'
import { NotEligibleForRebateBadge } from '@/app/settings/components/NotEligibleForRebateBadge'
import { shortenAddress } from '@/app/utils/address'
import { usePrivy } from '@privy-io/react-auth'
import { NeedsVerificationBadge } from '@/app/settings/components/NeedsVerificationBadge'
import { apiClient } from '@/app/helpers/apiClient'
import { MAX_CLAIMABLE_AMOUNT } from '@/app/constants/rebate'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

export type AppContractProps = {
  app: DeployedApp
  contract: Contract
  onStartVerification: (contract: Contract) => void
  onStartClaimRebate: (contract: Contract) => void
  onStartDeleteContract: (contract: Contract) => void
}

export const DeployedAppContract = ({
  contract,
  onStartVerification,
  onStartClaimRebate,
  onStartDeleteContract,
}: AppContractProps) => {
  const { user } = usePrivy()
  const { data: totalRebatesClaimed } =
    apiClient.Rebates.totalRebatesClaimed.useQuery()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(contract.contractAddress)

    toast({
      description: 'Contract Address Copied.',
      duration: LONG_DURATION,
    })
  }, [contract])
  const isDeploymentRebateEnabled = useFeatureFlag('enable_deployment_rebate')

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

    if (totalRebatesClaimed && totalRebatesClaimed >= MAX_CLAIMABLE_AMOUNT) {
      return items
    }

    if (contract.state === 'verified' && isDeploymentRebateEnabled) {
      if (contract.isEligibleForRebate) {
        items.push(
          <EligibleForRebateBadge
            key="rebate-badge"
            contract={contract}
            onStartClaimRebate={onStartClaimRebate}
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
  }, [
    contract,
    user,
    onStartVerification,
    isDeploymentRebateEnabled,
    onStartClaimRebate,
    totalRebatesClaimed,
  ])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-full mr-2">
          <div className="hidden sm:flex flex-row items-center relative">
            {contract.state === 'verified' ? (
              <RiCheckboxCircleFill className="text-green-600 absolute left-2" />
            ) : (
              <RiCloseCircleFill className="text-muted-foreground absolute left-2" />
            )}
            <Input
              className="hidden sm:flex pl-10 cursor-default focus-visible:ring-0"
              value={contract.contractAddress}
              readOnly
            />
          </div>

          <Input
            className="flex sm:hidden cursor-default focus-visible:ring-0"
            value={shortenAddress(contract.contractAddress)}
            readOnly
          />

          <div className="flex flex-row flex-wrap w-full gap-2 my-2 items-center">
            {badges}
          </div>
        </div>

        <div className="flex flex-row gap-2 items-start">
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0"
            aria-label="Copy Contract Address"
            onClick={handleCopy}
          >
            <RiFileCopyLine size={20} />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            aria-label="Delete Contract"
            onClick={() => onStartDeleteContract(contract)}
          >
            <RiCloseLine size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
