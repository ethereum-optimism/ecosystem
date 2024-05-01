'use client'

import { LONG_DURATION } from '@/app/constants/toast'
import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import { DeployedApp } from '@/app/settings/contracts/DeployedApp'
import { DeployedApp as ApiApp } from '@/app/types/api'
import {
  Button,
  Dialog,
  DialogContent,
  Text,
  toast,
} from '@eth-optimism/ui-components'
import { RiAddLine, RiAlertFill, RiLoader4Line } from '@remixicon/react'
import { useCallback, useState } from 'react'

export const DeployedApps = () => {
  const { data: appsRes, refetch: fetchApps } =
    apiClient.apps.listApps.useQuery({})
  const [appToDelete, setAppToDelete] = useState<ApiApp | undefined>()
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const apiUtils = apiClient.useUtils()
  const { mutateAsync: createApp } = apiClient.apps.createApp.useMutation()
  const { mutateAsync: deleteApp, isLoading: isDeleteAppLoading } =
    apiClient.apps.deleteApp.useMutation()

  const handleCreateApp = useCallback(async () => {
    try {
      const totalApps = (appsRes?.records.length ?? 0) + 1
      await createApp({ name: `New App ${totalApps}` })
      await fetchApps()
    } catch (e) {
      captureError(e, 'createApp')
    }
  }, [createApp, fetchApps, appsRes])

  const handleStartDeleteApp = useCallback(
    (app: ApiApp) => {
      setAppToDelete(app)
      setDeleteDialogOpen(true)
    },
    [setAppToDelete],
  )

  const handleDeleteApp = useCallback(async () => {
    if (!appToDelete) {
      return
    }

    try {
      await deleteApp({ appId: appToDelete.id })
      apiUtils.apps.listApps.invalidate()
      setAppToDelete(undefined)

      toast({
        description: 'Deleted application.',
        duration: LONG_DURATION,
      })
    } catch (e) {
      captureError(e, 'deleteApp')
    }
  }, [appToDelete, setAppToDelete, deleteApp, toast])

  const handleCancelDeleteApp = useCallback(() => {
    setAppToDelete(undefined)
    setDeleteDialogOpen(false)
  }, [setAppToDelete, setDeleteDialogOpen])

  return (
    <>
      <div className="flex flex-col space-y-6">
        {appsRes?.records.map((app) => (
          <DeployedApp
            key={app.id}
            app={app}
            onStartDeleteApp={handleStartDeleteApp}
          />
        ))}
      </div>
      <Button
        variant="outline"
        className="flex justify-between w-[120px] mt-2 mb-6"
        onClick={handleCreateApp}
      >
        <RiAddLine /> App app
      </Button>
      {appToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <div className="w-full flex flex-col items-center">
              <RiAlertFill className="rounded" size={64} />
              <Text
                as="p"
                className="cursor-default mt-4 mb-2 text-lg font-semibold"
              >
                Are you sure you want to delete this app?
              </Text>
              <Text
                as="p"
                className="cursor-default mb-4 text-muted-foreground text-base"
              >
                {appToDelete.name}
              </Text>

              <Button className="w-full mb-2" onClick={handleDeleteApp}>
                Continue{' '}
                {isDeleteAppLoading ? (
                  <RiLoader4Line className="ml-2 animate-spin" />
                ) : undefined}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleCancelDeleteApp}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
