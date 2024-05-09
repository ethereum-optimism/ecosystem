import Image from 'next/image'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  toast,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Hash } from 'viem'
import { useCallback, useMemo, useState } from 'react'
import { MAX_CLAIMABLE_AMOUNT } from '@/app/constants/rebate'
import { shortenAddress } from '@eth-optimism/op-app'
import Link from 'next/link'
import { ApiError, Contract } from '@/app/types/api'
import { Network } from '@/app/components/Network'
import { optimism } from 'viem/chains'
import { apiClient } from '@/app/helpers/apiClient'
import { formatEtherShort, getRebateBlockExplorerUrl } from '@/app/lib/utils'
import { RiLoader4Line } from '@remixicon/react'
import { LONG_DURATION } from '@/app/constants/toast'
import { trackClaimRebate } from '@/app/event-tracking/mixpanel'

export type ClaimRebateDialogProps = {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  contract: Contract
  onRebateClaimed: (contract: Contract) => void
}

const errorMessages: Record<string, string> = {
  MAX_REBATE_REACHED: 'Max rebate amount has been reached.',
  REBATE_ALREADY_CLAIMED: 'Rebate has already been claimed.',
  REBATE_PENDING: 'Rebate is already pending.',
  DUPLICATE_REBATE:
    'A rebate for this deployment transaction exists on another account.',
  FAILED_TO_SEND_REBATE: 'Failed to send rebate.',
}

export const ClaimRebateDialog = ({
  open,
  onOpenChange,
  contract,
  onRebateClaimed,
}: ClaimRebateDialogProps) => {
  const [rebateTxHash, setRebateTxHash] = useState<Hash | undefined>()

  const {
    mutateAsync: claimRebate,
    isLoading: isLoadingClaimRebate,
    error: rebateError,
  } = apiClient.Rebates.claimDeploymentRebate.useMutation()

  const { data: wallets } = apiClient.wallets.listWallets.useQuery({})
  const firstVerifiedWallet = useMemo(
    () => wallets?.records.find((wallet) => wallet.verifications.isCbVerified),
    [wallets],
  )

  const { data: totalRebateAmount } =
    apiClient.Rebates.totalRebatesClaimed.useQuery()
  const amountClaimed = useMemo(
    () => totalRebateAmount ?? BigInt(0),
    [totalRebateAmount],
  )

  const gasFeeToReimburst = useMemo(() => {
    if (!contract.transaction) {
      return '0.0'
    }

    const { gasPrice, gasUsed } = contract.transaction
    const gasAmount = BigInt(gasPrice) * BigInt(gasUsed)

    const claimableAmount =
      gasAmount + amountClaimed > MAX_CLAIMABLE_AMOUNT
        ? MAX_CLAIMABLE_AMOUNT - amountClaimed
        : gasAmount

    return formatEtherShort(claimableAmount, 'wei')
  }, [contract])

  const handleClaim = useCallback(async () => {
    if (isLoadingClaimRebate) {
      return
    }

    try {
      const { txHash } = await claimRebate({
        contractId: contract.id,
        recipientAddress: contract.deployerAddress,
      })

      toast({
        description: 'Rebate Claimed',
        duration: LONG_DURATION,
      })

      trackClaimRebate()
      setRebateTxHash(txHash)
      onRebateClaimed(contract)
    } catch (e) {
      const apiError = e as ApiError

      if (
        !Object.keys(errorMessages).includes(apiError.data?.customCode ?? '')
      ) {
        toast({
          description: 'Failed to claim rebate.',
          duration: LONG_DURATION,
        })
      }
    }
  }, [setRebateTxHash, onRebateClaimed])

  const handleViewTransaction = useCallback(() => {
    window.open(
      `${getRebateBlockExplorerUrl(contract.chainId)}/tx/${rebateTxHash}`,
      '_blank',
    )
  }, [contract, rebateTxHash])

  const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-center items-center">
          <Image
            src="/icons/celebrate.png"
            width={64}
            height={64}
            alt="Celebrate Rebate Icon"
          />

          <Text as="p" className="text-lg font-semibold">
            You’re eligible for the deployment rebate
          </Text>
        </DialogHeader>

        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-col">
            <Text as="p" className="text-muted-foreground font-medium">
              Contract
            </Text>
            <Text as="p">{shortenAddress(contract.contractAddress)}</Text>
          </div>

          <div className="flex flex-col">
            <Text
              as="p"
              className="text-right text-muted-foreground font-medium"
            >
              Gas fee rebate
            </Text>
            <Text as="p" className="text-right text-green-500">
              ~ {gasFeeToReimburst} ETH
            </Text>
          </div>
        </div>

        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-col">
            <Text as="p" className="text-muted-foreground font-medium">
              From
            </Text>
            <Text as="p">Optimism</Text>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-center">
              <Text
                as="p"
                className="text-right text-muted-foreground font-medium mr-1"
              >
                To
              </Text>
              <Network chainId={optimism.id} className="cursor-default" />
            </div>
            <Text as="p" className="text-right">
              {shortenAddress(contract.transaction!.fromAddress)}
            </Text>
          </div>
        </div>

        <Text as="p" className="text-sm text-center text-muted-foreground">
          *To-address is the same as your deployer address.
        </Text>

        <div className="flex flex-col w-full mt-3">
          {firstVerifiedWallet ? (
            <>
              <Button
                className="h-[48px]"
                onClick={rebateTxHash ? handleViewTransaction : handleClaim}
              >
                <Text as="span" className="cursor-pointer">
                  {rebateTxHash ? 'View Transaction' : 'Claim Rebate'}
                </Text>

                {isLoadingClaimRebate ? (
                  <RiLoader4Line className="ml-2 animate-spin" />
                ) : null}
              </Button>
              {rebateError?.data?.customCode && (
                <Text
                  as="p"
                  className="text-sm font-medium text-center text-destructive"
                >
                  {errorMessages[rebateError.data.customCode]}
                </Text>
              )}
            </>
          ) : (
            <Button className="h-[48px]" asChild>
              <Link
                href="https://www.coinbase.com/onchain-verify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text className="cursor-pointer" as="span">
                  Verify your onchain identity with Coinbase
                </Text>
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="mt-2 h-[48px]"
            onClick={handleCancel}
          >
            <Text as="span" className="cursor-pointer">
              Cancel
            </Text>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
