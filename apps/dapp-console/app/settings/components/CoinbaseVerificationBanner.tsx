import Image from 'next/image'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

export const CoinbaseVerificationBanner = () => (
  <div className="flex flex-row bg-blue-500/20 w-full p-8 rounded-xl items-center">
    <Image
      className="h-[40px] rounded-full mr-4"
      src="/logos/coinbase-logo.png"
      width={40}
      height={40}
      alt="Coinbase Logo"
    />
    <div className="flex flex-col">
      <Text as="p" className="text-base text-blue-500 font-semibold">
        Coinbase Verification is required for rebates
      </Text>
      <Text as="p" className="text-sm text-blue-500">
        You can verify any of your linked wallets.
      </Text>
    </div>
  </div>
)
