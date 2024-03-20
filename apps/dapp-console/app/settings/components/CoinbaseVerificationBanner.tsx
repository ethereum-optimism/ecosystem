import Image from 'next/image'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

export const CoinbaseVerificationBanner = () => (
  <div className="flex flex-row bg-[#d6e4ff] w-full p-8 rounded-xl items-center">
    <Image
      className="h-[40px] rounded-full mr-4"
      src="/logos/coinbase-logo.png"
      width={40}
      height={40}
      alt="Coinbase Logo"
    />
    <div className="flex flex-col">
      <Text as="p" className="text-base text-[#3374DB] font-semibold">
        Coinbase Verification is required for rebates
      </Text>
      <Text as="p" className="text-sm text-[#3374DB]">
        You can verify any of your linked wallets.
      </Text>
    </div>
  </div>
)
