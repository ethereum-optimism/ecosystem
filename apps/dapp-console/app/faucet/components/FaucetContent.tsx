import { Label } from '@eth-optimism/ui-components/src/components/ui/label/label'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { RadioCard } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-card'
import { RadioGroup } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-group'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Confetti } from '@eth-optimism/ui-components/src/components/ui/confetti/confetti'

import { isAddress } from 'viem'
import { useEffect, useState } from 'react'
import { getFormattedCountdown } from '@/app/utils'
import { Authentications } from '@/app/faucet/types'
import {
  Dialog,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { SuccessDialog } from '@/app/faucet/components/SuccessDialog'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { generateClaimSignature } from '@/app/faucet/helpers'
import { faucetNetworks } from '@/app/constants/faucet'
import { usePrivy } from '@privy-io/react-auth'
import { ClaimButton } from '@/app/faucet/components/ClaimButton'
import { useFaucetVerifications } from '@/app/hooks/useFaucetVerifications'
import { Alert } from '@eth-optimism/ui-components/src/components/ui/alert/alert'
import { AlertTitle } from '@eth-optimism/ui-components'
import { RiTimeLine } from '@remixicon/react'

type Props = {
  authentications: Authentications
}

const FaucetContent = ({ authentications }: Props) => {
  const { connectedWallet } = useConnectedWallet()
  const { authenticated } = usePrivy()
  const { secondsUntilNextDrip } = useFaucetVerifications()

  const [address, setAddress] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(faucetNetworks[0])
  const [countdown, setCountdown] = useState(secondsUntilNextDrip || 0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false)
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')

  useEffect(() => {
    if (secondsUntilNextDrip) {
      setCountdown(secondsUntilNextDrip)
    }

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1
        }
        return prevCountdown
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsUntilNextDrip])

  const hasAuthentication = Object.values(authentications).some(Boolean)
  const claimAmount = hasAuthentication ? 1 : 0.05

  const isValidAddress = isAddress(address)

  const isClaimDisabled =
    !authenticated || !isValidAddress || !selectedNetwork || countdown > 0

  const claimText =
    countdown > 0
      ? `Claim again in ${getFormattedCountdown(countdown)}`
      : `Claim ${claimAmount} ETH on ${selectedNetwork.label}`

  const claimSignatureMessage = generateClaimSignature(
    connectedWallet?.address || '',
    address,
  )

  useEffect(() => {
    if (!isDialogOpen) {
      handleCloseDialog()
    }
  }, [isDialogOpen])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsClaimSuccessful(false)
  }

  return (
    <div>
      {countdown > 0 && (
        <Alert className="mb-6 bg-blue-500/10 text-blue-500 border-none">
          <AlertTitle className="flex items-center mb-0 gap-2">
            <RiTimeLine size={18} />
            <span>
              You will be able to use the faucet again in{' '}
              {getFormattedCountdown(countdown)}
            </span>
          </AlertTitle>
        </Alert>
      )}
      <Label htmlFor="address">Address</Label>
      <div className="mb-6">
        <Input
          className="mt-4 mb-2"
          id="address"
          type="text"
          placeholder="Enter ETH address"
          value={address}
          onChange={handleAddressChange}
          disabled={countdown > 0 || !authenticated}
        />

        {address.length > 0 && !isValidAddress && (
          <Text className="text-red-500">Please enter a valid ETH address</Text>
        )}
      </div>

      <Label>Network</Label>
      <RadioGroup
        className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 sm:mb-10"
        value={selectedNetwork.label}
      >
        {faucetNetworks.map((network) => (
          <RadioCard
            key={network.chainID}
            value={network.label}
            onClick={() => {
              setSelectedNetwork(network)
            }}
            disabled={countdown > 0 || !authenticated}
          >
            <div className="flex gap-3 items-center">
              <img
                src={network.image}
                alt={network.label}
                className="w-10 h-10 rounded-full"
              />
              <Text as="span" className="text-base font-semibold">
                {network.label}
              </Text>
            </div>
          </RadioCard>
        ))}
      </RadioGroup>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ClaimButton
          isDisabled={isClaimDisabled}
          claimSignatureMessage={claimSignatureMessage}
          onClick={() => {
            setIsDialogOpen(true)
          }}
          chainId={selectedNetwork.chainID}
          authentications={authentications}
          recipientAddress={address}
          onSuccess={() => {
            setIsClaimSuccessful(true)
          }}
          setBlockExplorerUrl={setBlockExplorerUrl}
        >
          {claimText}
        </ClaimButton>
        <DialogContent>
          <SuccessDialog
            claimAmount={claimAmount}
            claimNetwork={selectedNetwork.label}
            closeDialog={handleCloseDialog}
            isClaimSuccessful={isClaimSuccessful}
            blockExplorerUrl={blockExplorerUrl}
          />
        </DialogContent>
      </Dialog>
      <Confetti runAnimation={isClaimSuccessful} zIndex={1000} />
    </div>
  )
}

export { FaucetContent }
