import { LONG_DURATION } from '@/app/constants/toast'
import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  toast,
} from '@eth-optimism/ui-components'
import { RiLoader4Line } from '@remixicon/react'
import { useCallback, useState } from 'react'

export type EditAppDialogProps = {
  id: string
  name: string
  open: boolean
  setOpenChange: (isOpen: boolean) => void
  onNameUpdated?: (updatedName: string) => void
}

export const EditAppDialog = ({
  id,
  name,
  open,
  onNameUpdated,
  setOpenChange,
}: EditAppDialogProps) => {
  const [editedName, setEditedName] = useState<string>(name)
  const { mutateAsync: updateName, isLoading: isEditAppLoading } =
    apiClient.apps.editApp.useMutation()

  const handleEditName = useCallback(async () => {
    try {
      await updateName({ appId: id, name: editedName })
      onNameUpdated?.(editedName)
      setOpenChange(false)

      toast({
        description: 'Updated application name.',
        duration: LONG_DURATION,
      })
    } catch (e) {
      captureError(e, 'editAppName')
    }
  }, [editedName, id, updateName, onNameUpdated, setOpenChange])

  const handleEditNameChange = useCallback(
    (e) => {
      setEditedName(e.target.value)
    },
    [setEditedName],
  ) as React.ChangeEventHandler<HTMLInputElement>

  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">App Name</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Edit App Name"
          value={editedName}
          onChange={handleEditNameChange}
        />

        <Button onClick={handleEditName}>
          Save{' '}
          {isEditAppLoading ? (
            <RiLoader4Line className="ml-2 animate-spin" />
          ) : undefined}
        </Button>
        <Button variant="outline" onClick={() => setOpenChange(false)}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  )
}
