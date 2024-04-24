import Image from 'next/image'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Hash, formatEther } from 'viem'
import { useCallback, useMemo, useState } from 'react'
import { MAX_CLAIMABLE_AMOUNT } from '@/app/constants/rebate'
import { shortenAddress } from '@eth-optimism/op-app'
import Link from 'next/link'
import { Contract } from '@/app/types/api'
import { Network } from '@/app/components/Network'
import { optimism } from 'viem/chains'
import { apiClient } from '@/app/helpers/apiClient'

export type ClaimRebateDialogProps = {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  contract: Contract
  onRebateClaimed: (contract: Contract) => void
}

export const ClaimRebateDialog = ({
  open,
  onOpenChange,
  contract,
  onRebateClaimed,
}: ClaimRebateDialogProps) => {
  const [rebateTxHash, setRebateTxHash] = useState<Hash | undefined>()

  const { mutateAsync: claimRebate } =
    apiClient.Rebates.claimDeploymentRebate.useMutation()

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

    return formatEther(claimableAmount, 'wei')
  }, [contract])

  const handleClaim = useCallback(async () => {
    const { txHash } = await claimRebate({
      contractId: contract.id,
      recipientAddress: contract.deployerAddress,
    })
    setRebateTxHash(txHash)
    onRebateClaimed(contract)
  }, [setRebateTxHash, onRebateClaimed])

  const handleViewTransaction = useCallback(() => {
    window.open(
      `${optimism.blockExplorers.default.url}/tx/${rebateTxHash}`,
      '_blank',
    )
  }, [rebateTxHash])

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
              <Network chainId={optimism.id} />
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
            <Button
              className="h-[48px]"
              onClick={rebateTxHash ? handleViewTransaction : handleClaim}
            >
              <Text as="span">
                {rebateTxHash ? 'View Transaction' : 'Claim Rebate'}
              </Text>
            </Button>
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
            <Text as="span">Cancel</Text>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
