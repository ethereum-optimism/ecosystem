'use client'

import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { Label } from '@eth-optimism/ui-components/src/components/ui/label/label'

import { usePrivy } from '@privy-io/react-auth'

export default function Account() {
  const { user } = usePrivy()

  if (!user) {
    return
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor="email" className="mb-2">
        Email
      </Label>
      <Input
        type="email"
        className="bg-secondary"
        value={user.email?.address ?? ''}
        disabled={true}
      />
    </div>
  )
}
