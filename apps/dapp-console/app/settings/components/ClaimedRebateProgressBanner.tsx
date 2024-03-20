'use client'

import { formatEther, parseEther } from 'viem'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { useMemo } from 'react'
import { Progress } from '@eth-optimism/ui-components/src/components/ui/progress'
import { RiQuestionFill } from '@remixicon/react'
import { RebateDialog } from '@/app/settings/components/RebateDialog'

export type ClaimedRebateProgressBannerProps = {
  claimedAmount?: bigint
  totalAmount?: bigint
}

const maxValue = parseEther('0.05')

export const ClaimedRebateProgressBanner = ({
  claimedAmount = parseEther('0.025'),
  totalAmount,
}: ClaimedRebateProgressBannerProps) => {
  const claimed = useMemo(
    () => (claimedAmount ? formatEther(claimedAmount) : '0.0'),
    [claimedAmount],
  )
  const total = useMemo(
    () => formatEther(totalAmount ?? maxValue),
    [totalAmount],
  )

  const progress = useMemo(() => {
    if (claimedAmount || totalAmount) {
      return 0
    }

    const total = totalAmount as bigint
    const claimed = claimedAmount as bigint

    if (total >= claimed) {
      return 100
    }

    return (Number(claimed) / Number(total)) * 100
  }, [claimedAmount, totalAmount])

  return (
    <div className="flex flex-col bg-accent w-full p-8 rounded-xl">
      <div className="flex flex-row w-full items-center flex-start">
        <Text as="span" className="font-semibold mr-1">
          {claimed}
        </Text>
        <Text as="span" className="text-base text-muted-foreground">
          of {total} ETH claimed
        </Text>

        <RebateDialog>
          <RiQuestionFill
            className="ml-1 cursor-pointer text-muted-foreground"
            size={16}
          />
        </RebateDialog>
      </div>
      <Progress value={progress} className="mt-2 rounded" />
    </div>
  )
}
