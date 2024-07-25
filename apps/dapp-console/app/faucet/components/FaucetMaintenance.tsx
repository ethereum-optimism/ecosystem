import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { RiToolsFill } from '@remixicon/react'
import Link from 'next/link'

const FaucetMaintenance = () => {
  return (
    <div className="flex flex-col items-center p-10">
      <RiToolsFill className="w-12 h-12 mb-4" />
      <Text as="h2" className="text-2xl font-semibold mb-2">
        Faucet is undergoing maintenance
      </Text>
      <Text as="p" className="text-md mb-4 text-center text-muted-foreground">
        We are currently fixing issues with the faucet, please check back later.
      </Text>
      <Button variant="secondary" asChild>
        <Link href="/">Go back</Link>
      </Button>
    </div>
  )
}

export { FaucetMaintenance }
