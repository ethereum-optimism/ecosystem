'use client'

import {
  Button,
  Input,
  Label,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import { usePrivy } from '@privy-io/react-auth'
import { RiEdit2Fill } from '@remixicon/react'

export default function Account() {
  const { user, updateEmail } = usePrivy()

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
          className="bg-secondary cursor-default mr-2"
          value={user.email?.address ?? ''}
          readOnly
        />
        <Button variant="secondary" onClick={updateEmail}>
          <Text as="span" className="hidden md:flex">
            Edit
          </Text>
          <RiEdit2Fill className="flex md:hidden" />
        </Button>
      </div>
    </div>
  )
}
