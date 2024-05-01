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
import { useCallback, useMemo, useState } from 'react'
import { DeployedApp as ApiDeployedApp, Contract } from '@/app/types/api'
import { DeployedAppContract } from '@/app/settings/contracts/DeployedAppContract'
import { apiClient } from '@/app/helpers/apiClient'
import { StartVerificationDialog } from '@/app/settings/contracts/StartVerificationDialog'
import { ClaimRebateDialog } from '@/app/settings/components/ClaimRebateDialog'
import { DeleteContractDialog } from '@/app/settings/contracts/DeleteContractDialog'
import { AppActionsDropdown } from '@/app/settings/contracts/AppActionsDropdown'

export type DeployedAppProps = {
  app: ApiDeployedApp
  onStartDeleteApp: (app: ApiDeployedApp) => void
}

export const DeployedApp = ({ app, onStartDeleteApp }: DeployedAppProps) => {
  const contracts = useMemo(() => app.contracts, [app])

  const [contractToVerifiy, setContractToVerify] = useState<
    Contract | undefined
  >()
  const [contractToRebate, setContractToRebate] = useState<
    Contract | undefined
  >()
  const [contractToDelete, setContractToDelete] = useState<
    Contract | undefined
  >()
  const [hasDraftContract, setHasDraftContract] = useState(
    app.contracts.length === 0,
  )
  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [isRebateDialogOpen, setRebateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
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

  const handleStartDeleteContract = useCallback(
    async (contract: Contract) => {
      setContractToDelete(contract)
      setDeleteDialogOpen(true)
    },
    [setContractToDelete, setDeleteDialogOpen],
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

  const handleDeleteDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      setContractToDelete(undefined)
      setDeleteDialogOpen(isOpen)
    },
    [setDeleteDialogOpen],
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

          <AppActionsDropdown
            app={app}
            onAppNameUpdated={handleUpdateAppName}
            onStartDeleteApp={onStartDeleteApp}
          >
            <Button size="icon" variant="ghost">
              <RiMoreLine />
            </Button>
          </AppActionsDropdown>
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
              onStartDeleteContract={handleStartDeleteContract}
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
        {contractToDelete && (
          <DeleteContractDialog
            contract={contractToDelete}
            open={isDeleteDialogOpen}
            onOpenChange={handleDeleteDialogOpenChange}
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
