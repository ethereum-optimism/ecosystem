import Image from 'next/image'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@eth-optimism/ui-components'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Address, Transaction, formatEther } from 'viem'
import { useCallback, useMemo, useState } from 'react'
import { MAX_CLAIMABLE_AMOUNT } from '@/app/constants/rebate'
import { shortenAddress } from '@eth-optimism/op-app'
import Link from 'next/link'

export type ClaimRebateDialogProps = {
  contractAddress: Address
  contractDeploymentTransaction: Transaction
  amountClaimed?: bigint
  isVerified?: boolean
  children: React.ReactNode
}

export const ClaimRebateDialog = ({
  contractAddress,
  contractDeploymentTransaction,
  amountClaimed = BigInt(0),
  isVerified = false,
  children,
}: ClaimRebateDialogProps) => {
  const [isOpen, setOpen] = useState(false)

  const gasFeeToReimburst = useMemo(() => {
    const gasAmount = contractDeploymentTransaction.gas

    const claimableAmount =
      gasAmount + amountClaimed > MAX_CLAIMABLE_AMOUNT
        ? MAX_CLAIMABLE_AMOUNT - amountClaimed
        : gasAmount

    return formatEther(claimableAmount)
  }, [contractDeploymentTransaction])

  const handleClaim = useCallback(() => {
    // TODO: add backend call here to claim rebate
    setOpen(false)
  }, [setOpen])

  const handleCancel = useCallback(() => setOpen(false), [setOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            <Text as="p">{shortenAddress(contractAddress)}</Text>
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
                className="text-right text-muted-foreground font-medium"
              >
                To
              </Text>
              <Image
                className="mx-1"
                src="/logos/op-logo.svg"
                width={20}
                height={20}
                alt="Optimism Logo"
              />
              <Text
                as="p"
                className="text-right text-muted-foreground font-medium"
              >
                OP Mainnet
              </Text>
            </div>
            <Text as="p" className="text-right">
              {shortenAddress(contractDeploymentTransaction.from)}
            </Text>
          </div>
        </div>

        <Text as="p" className="text-sm text-center text-muted-foreground">
          *To-address is the same as your deployer address.
        </Text>

        <div className="flex flex-col w-full mt-3">
          {isVerified ? (
            <Button className="h-[48px]" onClick={handleClaim}>
              <Text as="span">Claim Rebate</Text>
            </Button>
          ) : (
            <Button className="h-[48px]" asChild>
              <Link
                href="https://www.coinbase.com/onchain-verify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text as="span">Get Verified</Text>
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
