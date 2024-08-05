import { shortenAddress } from '@/app/utils/address'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiCloseLine,
  RiFileCopyLine,
  RiLoader4Line,
} from '@remixicon/react'
import { useCallback, useState } from 'react'
import { useToast } from '@eth-optimism/ui-components'
import { LONG_DURATION } from '@/app/constants/toast'
import { Address } from 'viem'
import { CoinbaseVerificationBadge } from '@/app/components/Badges/CoinbaseVerificationBadge'

export type LinkedWalletProps = {
  id: string
  address: Address
  isCbVerified: boolean
  onUnlink: () => Promise<void>
}

export const LinkedWallet = ({
  address,
  onUnlink,
  isCbVerified,
}: LinkedWalletProps) => {
  const { toast } = useToast()
  const [isLoadingUnlink, setIsLoadingUnlink] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUnlink = useCallback(async () => {
    setIsLoadingUnlink(true)
    await onUnlink()
    setIsLoadingUnlink(false)
  }, [onUnlink])
  const handleCancel = useCallback(
    () => setIsDialogOpen(false),
    [setIsDialogOpen],
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address)
    toast({
      description: 'Address Copied',
      duration: LONG_DURATION,
    })
  }, [address, toast])

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col w-full">
        <div className="hidden sm:flex relative items-center">
          <RiCheckboxCircleFill className="text-green-600 absolute left-2" />

          <Input
            value={address}
            readOnly
            className="pl-10 cursor-default hidden sm:flex focus-visible:ring-0"
          />
        </div>
        <Input
          value={shortenAddress(address)}
          readOnly
          className="cursor-default flex sm:hidden focus-visible:ring-0"
        />
        {isCbVerified && <CoinbaseVerificationBadge />}
      </div>

      <Button
        variant="secondary"
        size="icon"
        aria-label="Unlink Wallet"
        onClick={handleCopy}
      >
        <RiFileCopyLine size={20} />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Unlink Wallet">
            <RiCloseLine size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="w-full flex flex-col items-center">
            <RiAlertFill className="rounded" size={64} />
            <Text
              as="p"
              className="cursor-default mt-4 mb-2 text-lg font-semibold"
            >
              Are you sure you want to unlink this wallet?
            </Text>
            <Text
              as="p"
              className="cursor-default mb-4 text-muted-foreground text-base"
            >
              {shortenAddress(address)}
            </Text>

            <Button className="w-full mb-2" onClick={handleUnlink}>
              Unlink{' '}
              {isLoadingUnlink ? (
                <RiLoader4Line className="ml-2 animate-spin" />
              ) : undefined}
            </Button>
            <Button className="w-full" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
