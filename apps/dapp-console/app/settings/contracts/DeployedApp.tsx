'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'

import { AddContractFlow } from '@/app/settings/contracts/AddContractFlow'
import { RiMoreLine } from '@remixicon/react'
import { EditAppDialog } from '@/app/settings/contracts/EditAppDialog'
import { useCallback, useState } from 'react'
import { DeployedApp as ApiDeployedApp, Contract } from '@/app/types/api'
import { DeployedAppContract } from '@/app/settings/contracts/DeployedAppContract'
import { apiClient } from '@/app/helpers/apiClient'
import { StartVerificationDialog } from '@/app/settings/contracts/StartVerificationDialog'

export type DeployedAppProps = {
  app: ApiDeployedApp
}

export const DeployedApp = ({ app }: DeployedAppProps) => {
  const [contracts, setContracts] = useState(app.contracts)
  const [contractToVerifiy, setContractToVerify] = useState<
    Contract | undefined
  >()
  const [hasDraftContract, setHasDraftContract] = useState(
    app.contracts.length === 0,
  )
  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [appName, setAppName] = useState<string>(app.name)

  const { refetch: fetchContracts } =
    apiClient.Contracts.listContractsForApp.useQuery(
      { appId: app.id },
      { enabled: false },
    )

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

      const { data: contracts } = await fetchContracts()
      setContracts(contracts as Contract[])
      setHasDraftContract(false)
    },
    [setContracts, setContractToVerify, setVerifyDialogOpen],
  )

  const handleContractVerified = useCallback(async () => {
    const { data: contracts } = await fetchContracts()
    setContracts(contracts as Contract[])
  }, [setContracts, fetchContracts])

  const handleVerifyDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      setContractToVerify(undefined)
      setVerifyDialogOpen(isOpen)
    },
    [setVerifyDialogOpen],
  )

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
        {contracts.map((contract) => (
          <DeployedAppContract
            app={app}
            contract={contract}
            onStartVerification={handleStartVerification}
          />
        ))}
        {hasDraftContract && (
          <AddContractFlow
            appId={app.id}
            onStartVerification={handleStartVerification}
          />
        )}
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
        <Button
          variant="outline"
          onClick={() => setHasDraftContract(true)}
          disabled={hasDraftContract || pendingContracts.length > 0}
        >
          Add Contract
        </Button>
      </CardContent>
    </Card>
  )
}
