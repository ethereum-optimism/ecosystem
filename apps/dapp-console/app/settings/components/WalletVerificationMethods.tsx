import Image from 'next/image'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@eth-optimism/ui-components/src/components/ui/accordian/accordion'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator/separator'
import Link from 'next/link'

type VerificationMethod = {
  id: string
  icon: string
  title: string
  description?: string
  href: string
}

const verificationMethods: VerificationMethod[] = [
  {
    id: 'attestation',
    icon: '/logos/attestation-logo.png',
    title: 'Attestation',
    description: 'Valid within 7 days',
    href: 'https://attest.sh/',
  },
  {
    id: 'coinbase',
    icon: '/logos/coinbase-logo.png',
    title: 'Coinbase Verification',
    description: 'Required for Deployment Rebase and Superchain Paymaster',
    href: 'https://www.coinbase.com/onchain-verify',
  },
  {
    id: 'gitcoin',
    icon: '/logos/gitcoin-logo.png',
    title: 'Gitcoin',
    description: 'Passport score > 25',
    href: 'https://passport.gitcoin.co/',
  },
  {
    id: 'optimist',
    icon: '/logos/optimist-nft-logo.png',
    title: 'Optimist NFT',
    href: 'https://app.optimism.io/optimist-nft',
  },
  {
    id: 'worldid',
    icon: '/logos/worldid-logo.png',
    title: 'WorldID Orb',
    href: 'https://worldcoin.org/world-id',
  },
]

export const WalletVerificationMethods = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="wallet-verifications" className="border-none">
        <AccordionTrigger className="hover:no-underline justify-start">
          <Text className="text-base font-medium mr-2">
            See verification methods
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col">
            <Text as="p" className="text-base my-4 text-muted-foreground">
              To verify your onchain identity, link a wallet associated with any
              method below.
            </Text>
            {verificationMethods.map((method) => (
              <div key={method.id} className="flex flex-col w-full">
                <div className="flex flex-row my-3 justify-between">
                  <div className="flex flex-row items-center">
                    <Image
                      src={method.icon}
                      alt={method.title}
                      width={40}
                      height={40}
                      className="h-[40px] rounded-full"
                    />

                    <div className="ml-2 flex flex-col">
                      <Text className="text-sm font-medium">
                        {method.title}
                      </Text>
                      {method.description && (
                        <Text className="text-sm text-muted-foreground">
                          {method.description}
                        </Text>
                      )}
                    </div>
                  </div>

                  <Button variant="outline">
                    <Link
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </Link>
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
            <Text as="p" className="text-base mt-8 text-muted-foreground">
              Verification is required for some offers. Plus, with verification
              you’ll get maximum test tokens from the Superchain Faucet. That’s
              up to 1 test ETH (instead of 0.05 test ETH) on 1 test network
              every 24 hours.
            </Text>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
