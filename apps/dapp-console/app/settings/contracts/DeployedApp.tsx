'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'

import { AddContractFlow } from '@/app/settings/contracts/AddContractFlow'
import { RiAddLine, RiMoreLine } from '@remixicon/react'
import { EditAppDialog } from '@/app/settings/contracts/EditAppDialog'
import { useCallback, useMemo, useState } from 'react'
import { DeployedApp as ApiDeployedApp, Contract } from '@/app/types/api'
import { DeployedAppContract } from '@/app/settings/contracts/DeployedAppContract'
import { apiClient } from '@/app/helpers/apiClient'
import { StartVerificationDialog } from '@/app/settings/contracts/StartVerificationDialog'
import { ClaimRebateDialog } from '@/app/settings/components/ClaimRebateDialog'

export type DeployedAppProps = {
  app: ApiDeployedApp
}

export const DeployedApp = ({ app }: DeployedAppProps) => {
  const contracts = useMemo(() => app.contracts, [app])
  const [contractToVerifiy, setContractToVerify] = useState<
    Contract | undefined
  >()
  const [contractToRebate, setContractToRebate] = useState<
    Contract | undefined
  >()
  const [hasDraftContract, setHasDraftContract] = useState(
    app.contracts.length === 0,
  )
  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [isRebateDialogOpen, setRebateDialogOpen] = useState(false)
  const [appName, setAppName] = useState<string>(app.name)

  const apiUtils = apiClient.useUtils()

  const handleUpdateAppName = useCallback(
    (updatedName: string) => {
      setAppName(updatedName)
    },
    [setAppName],
  )

  const handleStartVerification = useCallback(
    async (contract: Contract) => {
      setContractToVerify(contract)
      setVerifyDialogOpen(true)
      apiUtils.apps.listApps.invalidate()
      setHasDraftContract(false)
    },
    [setContractToVerify, setVerifyDialogOpen, apiUtils],
  )

  const handleContractVerified = useCallback(async () => {
    apiUtils.apps.listApps.invalidate()
  }, [apiUtils])

  const handleVerifyDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      setContractToVerify(undefined)
      setVerifyDialogOpen(isOpen)
    },
    [setVerifyDialogOpen],
  )

  const handleStartClaimRebate = useCallback(
    async (contract: Contract) => {
      setContractToRebate(contract)
      setRebateDialogOpen(true)
    },
    [setContractToRebate],
  )

  const handleRebateDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      setContractToRebate(undefined)
      setRebateDialogOpen(isOpen)
    },
    [setRebateDialogOpen],
  )

  const handleRebateClaimed = useCallback(async () => {
    apiUtils.apps.listApps.invalidate()
    apiUtils.Rebates.totalRebatesClaimed.invalidate()
    apiUtils.Rebates.listCompletedRebates.invalidate()
  }, [apiUtils])

  const pendingContracts = contracts.filter(
    (contract) => contract.state === 'not_verified',
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row w-full justify-between items-center">
          <CardTitle>{appName}</CardTitle>

          <EditAppDialog
            id={app.id}
            name={app.name}
            onNameUpdated={handleUpdateAppName}
          >
            <Button size="icon" variant="ghost">
              <RiMoreLine />
            </Button>
          </EditAppDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {contracts.map((contract) => (
            <DeployedAppContract
              key={contract.id}
              app={app}
              contract={contract}
              onStartVerification={handleStartVerification}
              onStartClaimRebate={handleStartClaimRebate}
            />
          ))}
          {hasDraftContract && (
            <AddContractFlow
              appId={app.id}
              onStartVerification={handleStartVerification}
            />
          )}
        </div>
        {contractToVerifiy && (
          <StartVerificationDialog
            contract={contractToVerifiy}
            initialStep={
              contractToVerifiy.state === 'verified' ? 'verified' : 'begin'
            }
            open={isVerifyDialogOpen}
            onOpenChange={handleVerifyDialogOpenChange}
            onContractVerified={handleContractVerified}
          />
        )}
        {contractToRebate && (
          <ClaimRebateDialog
            contract={contractToRebate}
            open={isRebateDialogOpen}
            onOpenChange={handleRebateDialogOpenChange}
            onRebateClaimed={handleRebateClaimed}
          />
        )}
        <Button
          className="mt-3"
          variant="outline"
          onClick={() => setHasDraftContract(true)}
          disabled={hasDraftContract || pendingContracts.length > 0}
        >
          <RiAddLine /> Add Contract
        </Button>
      </CardContent>
    </Card>
  )
}
