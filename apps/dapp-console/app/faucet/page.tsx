'use client'

import { CardContent, CardHeader } from '@eth-optimism/ui-components'
import { Card } from '@eth-optimism/ui-components/src/components/ui/card/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { FaucetHeader } from '@/app/faucet/components/FaucetHeader'
import { useEffect } from 'react'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'
import { useRouter } from 'next/navigation'
import { FaucetContent } from '@/app/faucet/components/FaucetContent'
import { Tile } from '@/app/components/Tile/Tile'
import { Faqs } from '@/app/faucet/components/Faqs'

const authentications = {
  coinbase: false,
  worldId: false,
  gitcoin: false,
  eas: false,
}

export default function Faucet() {
  const isConsoleFaucetEnabled = useFeatureFlag('enable_console_faucet')
  const router = useRouter()

  // Redirect to the home page if the faucet is disabled
  useEffect(() => {
    if (!isConsoleFaucetEnabled) {
      router.push('/')
    }
  }, [isConsoleFaucetEnabled, router])

  return (
    <div className="flex flex-col w-full items-center py-10 px-2 pb-20 sm:px-6 ">
      <div className="text-center mb-10 px-4">
        <Text as="h1" className="text-3xl sm:text-5xl font-semibold mb-2">
          Superchain Faucet
        </Text>
        <Text
          as="p"
          className="text-md sm:text-lg text-center text-muted-foreground"
        >
          Get test tokens for building applications on the Superchain
        </Text>
      </div>
      <Card className="w-full max-w-screen-lg">
        <CardHeader>
          <FaucetHeader authentications={authentications} />
        </CardHeader>
        <div className="w-full border-t-1 border-border pb-6" />
        <CardContent>
          <FaucetContent authentications={authentications} />
        </CardContent>
      </Card>
      <Tile
        className="w-full max-w-screen-lg my-10"
        variant="secondary"
        title="Apply for bulk tokens →"
        description="Superchain faucet only dispenses a small number of test ETH each day. Apply to get test tokens in bulk."
        onClick={() => {}}
      />
      <Faqs />
    </div>
  )
}
