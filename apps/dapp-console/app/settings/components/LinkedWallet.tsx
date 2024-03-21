import { shortenAddress } from '@eth-optimism/op-app'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { WalletWithMetadata } from '@privy-io/react-auth'
import { RiAlertFill, RiCloseLine } from '@remixicon/react'
import { useCallback, useState } from 'react'

export type LinkedWalletProps = {
  wallet: WalletWithMetadata
  onUnlink: (wallet: WalletWithMetadata) => void
}

export const LinkedWallet = ({ wallet, onUnlink }: LinkedWalletProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUnlink = useCallback(() => onUnlink(wallet), [wallet, onUnlink])
  const handleCancel = useCallback(
    () => setIsDialogOpen(false),
    [setIsDialogOpen],
  )

  return (
    <div className="flex flex-row gap-2">
      <Input className="rounded" value={wallet.address} disabled />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded"
            variant="secondary"
            size="icon"
            aria-label="Unlink Wallet"
          >
            <RiCloseLine />
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
              {shortenAddress(wallet.address)}
            </Text>

            <Button className="rounded w-full mb-2" onClick={handleUnlink}>
              Unlink
            </Button>
            <Button
              className="rounded w-full"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
