import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
} from '@eth-optimism/ui-components'
import { formatEther } from 'viem'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { shortenAddress } from '@eth-optimism/op-app'
import { RiArrowRightSLine } from '@remixicon/react'
import Link from 'next/link'
import { apiClient } from '@/app/helpers/apiClient'
import { optimism } from 'viem/chains'
import { getDateString } from '@/app/lib/utils'

export const ClaimedRebates = () => {
  const { data: rebateResp } = apiClient.Rebates.listCompletedRebates.useQuery(
    {},
  )

  if (!rebateResp?.records.length) {
    // don't show anything if the user hasn't claimed any rebates
    return null
  }

  const rebates = rebateResp.records

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
                  href={`${optimism.blockExplorers.default.url}/tx/${rebate.rebateTxHash}`}
                  target="_blank"
                >
                  <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-col py-8">
                      <Text as="p" className="font-semibold">
                        {rebate.rebateTxTimestamp &&
                          getDateString(rebate.rebateTxTimestamp)}
                      </Text>
                      <Text as="p" className="text-muted-foreground">
                        Contract: {shortenAddress(rebate.contractAddress)}
                      </Text>
                    </div>
                    <div className="flex flex-row items-center">
                      <Text as="span" className="font-semibold">
                        {formatEther(BigInt(rebate.rebateAmount ?? 0), 'wei')}{' '}
                        ETH
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
