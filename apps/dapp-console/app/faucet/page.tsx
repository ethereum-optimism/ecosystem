'use client'

import { CardHeader } from '@eth-optimism/ui-components'
import { Card } from '@eth-optimism/ui-components/src/components/ui/card/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { FaucetHeader } from './components/FaucetHeader/FaucetHeader'
import { useWallets } from '@privy-io/react-auth'

export default function Faucet() {
  const signedIn = false
  const wallet = 'asdf'
  const authentications = null

  return (
    <div className="flex flex-col w-full items-center py-10 px-6">
      <div className="text-center mb-10">
        <Text as="h1" className="text-5xl font-semibold mb-2">
          Superchain Faucet
        </Text>
        <Text as="p" className="text-lg text-center text-muted-foreground">
          Get test tokens for building applications on the Superchain
        </Text>
      </div>

      <Card>
        <CardHeader>
          <FaucetHeader
            signedIn={signedIn}
            wallet={wallet}
            authentications={authentications}
          />
        </CardHeader>
      </Card>
    </div>
  )
}
