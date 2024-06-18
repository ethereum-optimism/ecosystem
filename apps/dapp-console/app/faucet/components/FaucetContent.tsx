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

type Props = {
  authentications: Authentications
}

const FaucetContent = ({ authentications }: Props) => {
  const { connectedWallet } = useConnectedWallet()
  const { authenticated } = usePrivy()
  // Replace with real values from the backend
  const secondsToNextDrip = 0

  const [address, setAddress] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(faucetNetworks[0])
  const [countdown, setCountdown] = useState(secondsToNextDrip)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isClaimSuccessful, setIsClaimSuccessful] = useState(false)

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
    const interval = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  return (
    <div>
      <Label htmlFor="address">Address</Label>
      <div className="mb-6">
        <Input
          className="mt-4 mb-2"
          id="address"
          type="text"
          placeholder="Enter ETH address"
          value={address}
          onChange={handleAddressChange}
        />

        {address.length > 0 && !isValidAddress && (
          <Text className="text-red-500">Please enter a valid ETH address</Text>
        )}
      </div>

      <Label>Network</Label>
      <RadioGroup
        className="mt-4 mb-10 grid grid-cols-1 sm:grid-cols-2"
        value={selectedNetwork.label}
      >
        {faucetNetworks.map((network) => (
          <RadioCard
            key={network.chainID}
            value={network.label}
            onClick={() => {
              setSelectedNetwork(network)
            }}
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
        >
          {claimText}
        </ClaimButton>
        <DialogContent>
          <SuccessDialog
            claimAmount={claimAmount}
            claimNetwork={selectedNetwork.label}
            closeDialog={() => {
              setIsDialogOpen(false)
            }}
            isClaimSuccessful={isClaimSuccessful}
          />
        </DialogContent>
      </Dialog>
      <Confetti runAnimation={isClaimSuccessful} zIndex={1000} />
    </div>
  )
}

export { FaucetContent }
