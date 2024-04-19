import { DeployedApp, Contract } from '@/app/types/api'
import { AddContractFlow } from '@/app/settings/contracts/AddContractFlow'
import { Button, Input, toast } from '@eth-optimism/ui-components'
import { HexBadge } from '@/app/components/Badges/HexBadge'
import { RiFileCopyLine } from '@remixicon/react'
import { NetworkBadge } from '@/app/components/Badges/NetworkBadge'
import { useCallback } from 'react'
import { LONG_DURATION } from '@/app/constants/toast'
import { EligibleForRebateBadge } from '@/app/settings/components/EligibleForRebateBadge'
import { NotEligibleForRebateBadge } from '@/app/settings/components/NotEligibleForRebateBadge'
import { shortenAddress } from '@eth-optimism/op-app'
import { usePrivy } from '@privy-io/react-auth'

export type AppContractProps = {
  app: DeployedApp
  contract: Contract
  onStartVerification: (contract: Contract) => void
}

export const DeployedAppContract = ({
  app,
  contract,
  onStartVerification,
}: AppContractProps) => {
  const { user } = usePrivy()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(contract.contractAddress)

    toast({
      description: 'Contract Address Copied.',
      duration: LONG_DURATION,
    })
  }, [contract])

  if (contract.state === 'not_verified') {
    return (
      <AddContractFlow
        appId={app.id}
        unverifiedContract={contract}
        onStartVerification={onStartVerification}
      />
    )
  }

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
            <NetworkBadge chainId={contract.chainId} />
            <HexBadge label="Deployer" value={contract.deployerAddress} />
            <HexBadge label="Tx" value={contract.deploymentTxHash} />

            {contract.isEligibleForRebate ? (
              <EligibleForRebateBadge contract={contract} />
            ) : (
              <NotEligibleForRebateBadge user={user} contract={contract} />
            )}
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
