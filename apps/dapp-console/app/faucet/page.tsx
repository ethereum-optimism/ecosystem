'use client'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { useFeatureFlag } from '../hooks/useFeatureFlag'

export default function Faucet() {
  const isSettingsEnabled = useFeatureFlag('enable_console_faucet')

  return (
    <div className="flex flex-col w-full items-center py-10 px-6">
      <div className="text-center">
        <Text as="h1" className="text-5xl font-semibold mb-2">
          Superchain Faucet
        </Text>
        <Text as="p" className="text-lg text-center text-muted-foreground">
          Get test tokens for building applications on the Superchain
        </Text>
      </div>
    </div>
  )
}
