import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
} from '@eth-optimism/ui-components'
import { Address, Chain, Hash, formatEther, parseEther } from 'viem'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { shortenAddress } from '@eth-optimism/op-app'
import { RiArrowRightSLine } from '@remixicon/react'
import Link from 'next/link'
import { optimism } from 'viem/chains'

export type Rebate = {
  id: string
  chain: Chain
  contractAddress: Address
  timestamp: string
  txHash: Hash
  value: bigint
}

export type CliamedRebateProps = {
  rebates?: Rebate[]
}

export const ClaimedRebates = ({
  rebates = [
    {
      id: '1',
      chain: optimism,
      contractAddress: '0x3065b9bd9250Be77D821EdcB3ec46B273f3BA64d',
      txHash:
        '0xba9b8cdb69108ceb3f8384db91f1e9c361841b99d3a0aca61de676813f3097cf',
      timestamp: 'Feb 25, 2024',
      value: parseEther('1.0'),
    },
    {
      id: '2',
      chain: optimism,
      contractAddress: '0x3065b9bd9250Be77D821EdcB3ec46B273f3BA64d',
      txHash:
        '0xba9b8cdb69108ceb3f8384db91f1e9c361841b99d3a0aca61de676813f3097cf',
      timestamp: 'Feb 25, 2024',
      value: parseEther('10.0'),
    },
  ],
}: CliamedRebateProps) => {
  if (!rebates.length) {
    // don't show anything if the user hasn't claimed any rebates
    return null
  }

  return (
    <div className="flex flex-col w-full">
      <Accordion type="single" collapsible>
        <AccordionItem value="rebates" className="border-none">
          <AccordionTrigger className="hover:no-underline justify-start">
            <Text className="font-semibold mr-1">See transactions</Text>
          </AccordionTrigger>
          <AccordionContent>
            {rebates.map((rebate) => (
              <div key={rebate.id} className="flex flex-col w-full">
                <Link
                  href={`${rebate.chain.blockExplorers?.default.url}/tx/${rebate.txHash}`}
                  target="_blank"
                >
                  <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-col py-8">
                      <Text as="p" className="font-semibold">
                        {rebate.timestamp}
                      </Text>
                      <Text as="p" className="text-muted-foreground">
                        Contract: {shortenAddress(rebate.contractAddress)}
                      </Text>
                    </div>
                    <div className="flex flex-row items-center">
                      <Text as="span" className="font-semibold">
                        {formatEther(rebate.value)} ETH
                      </Text>
                      <RiArrowRightSLine />
                    </div>
                  </div>
                  <Separator />
                </Link>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
