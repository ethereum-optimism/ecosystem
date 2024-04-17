import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@eth-optimism/ui-components'
import { useCallback, useState } from 'react'

export type EditAppDialogProps = {
  id: string
  name: string
  onNameUpdated?: (updatedName: string) => void
  children: React.ReactNode
}

export const EditAppDialog = ({
  id,
  name,
  children,
  onNameUpdated,
}: EditAppDialogProps) => {
  const [editedName, setEditedName] = useState<string>(name)
  const [open, setIsOpen] = useState<boolean>(false)
  const { mutateAsync: updateName } = apiClient.apps.editApp.useMutation()

  const handleEditName = useCallback(async () => {
    try {
      await updateName({ appId: id, name: editedName })
      onNameUpdated?.(editedName)
      setIsOpen(false)
    } catch (e) {
      captureError(e, 'editAppName')
    }
  }, [editedName, id, updateName, onNameUpdated, setIsOpen])

  const handleEditNameChange = useCallback(
    (e) => {
      setEditedName(e.target.value)
    },
    [setEditedName],
  ) as React.ChangeEventHandler<HTMLInputElement>

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">App Name</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Edit App Name"
          value={editedName}
          onChange={handleEditNameChange}
        />

        <Button onClick={handleEditName}>Save</Button>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  )
}
