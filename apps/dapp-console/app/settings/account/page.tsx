'use client'

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  Separator,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import { usePrivy } from '@privy-io/react-auth'
import { RiAlertFill, RiEdit2Fill } from '@remixicon/react'
import { useCallback, useState } from 'react'

export default function Account() {
  const [isOpen, setOpen] = useState(false)
  const { user, updateEmail } = usePrivy()

  const handleDeleteAccount = useCallback(() => {
    // TODO: add backend call here

    // hard refresh after deleting user
    window.location.href = '/'
  }, [])

  const handleCancel = useCallback(() => setOpen(false), [setOpen])

  if (!user) {
    return
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor="email" className="mb-2">
        Email
      </Label>

      <div className="flex flex-row mb-10">
        <Input
          type="email"
          className="bg-secondary rounded cursor-default mr-2"
          value={user.email?.address ?? ''}
          disabled={true}
        />
        <Button variant="secondary" className="rounded" onClick={updateEmail}>
          <Text as="span" className="hidden md:flex">
            Edit
          </Text>
          <RiEdit2Fill className="flex md:hidden" />
        </Button>
      </div>

      <Separator />

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-8 self-start">
            <Text as="span" className="text-red-800">
              Delete account
            </Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="w-full flex flex-col items-center">
            <RiAlertFill className="rounded" size={64} />
          </div>
          <Text
            as="p"
            className="cursor-default mt-4 mb-2 text-center text-lg font-semibold"
          >
            Are you sure you want to delete your account?
          </Text>
          <Button className="rounded w-full" onClick={handleDeleteAccount}>
            Delete account
          </Button>
          <Button
            className="rounded w-full"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
