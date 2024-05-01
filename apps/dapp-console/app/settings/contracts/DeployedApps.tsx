'use client'

import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import { DeployedApp } from '@/app/settings/contracts/DeployedApp'
import { Button } from '@eth-optimism/ui-components'
import { RiAddLine } from '@remixicon/react'
import { useCallback } from 'react'

export const DeployedApps = () => {
  const { data: appsRes, refetch: fetchApps } =
    apiClient.apps.listApps.useQuery({})
  const { mutateAsync: createApp } = apiClient.apps.createApp.useMutation()

  const handleCreateApp = useCallback(async () => {
    try {
      const totalApps = (appsRes?.records.length ?? 0) + 1
      await createApp({ name: `New App ${totalApps}` })
      await fetchApps()
    } catch (e) {
      captureError(e, 'createApp')
    }
  }, [createApp, fetchApps, appsRes])

  return (
    <>
      <div className="flex flex-col space-y-6">
        {appsRes?.records.map((app) => <DeployedApp key={app.id} app={app} />)}
      </div>
      <Button
        variant="outline"
        className="flex justify-between w-[120px] mt-2 mb-6"
        onClick={handleCreateApp}
      >
        <RiAddLine /> App app
      </Button>
    </>
  )
}
