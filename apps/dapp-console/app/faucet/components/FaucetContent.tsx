'use client'

import { Label } from '@eth-optimism/ui-components/src/components/ui/label/label'
import { Input } from '@eth-optimism/ui-components/src/components/ui/input/input'
import { RadioCard } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-card'
import { RadioGroup } from '@eth-optimism/ui-components/src/components/ui/radio-group/radio-group'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Confetti } from '@eth-optimism/ui-components/src/components/ui/confetti/confetti'

import { isAddress } from 'viem'
import { useEffect, useState } from 'react'
import { getFormattedCountdown } from '@/app/utils'
import { ClaimStatus } from '@/app/faucet/types'
import {
  Dialog,
  DialogContent,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { SuccessDialog } from '@/app/faucet/components/SuccessDialog'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { generateClaimSignature } from '@/app/faucet/helpers'
import { getFaucetNetworks } from '@/app/constants/faucet'
import { usePrivy } from '@privy-io/react-auth'
import { ClaimButton } from '@/app/faucet/components/ClaimButton'
import { useFaucetVerifications } from '@/app/hooks/useFaucetVerifications'
import { Alert } from '@eth-optimism/ui-components/src/components/ui/alert/alert'
import { AlertTitle } from '@eth-optimism/ui-components'
import { RiTimeLine } from '@remixicon/react'
import { useFaucetNetworks } from '@/app/hooks/useFaucetNetworks'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

const FaucetContent = () => {
  const { connectedWallet } = useConnectedWallet()
  const { faucetAuthentications } = useFaucetVerifications()

  const { authenticated } = usePrivy()
  const { secondsUntilNextDrip, refetchNextDrips } = useFaucetVerifications()
  const { unavailableNetworksChainIds } = useFaucetNetworks()

  const [address, setAddress] = useState('')

  const showNewLogo = useFeatureFlag('enable_new_brand')
  const faucetNetworks = getFaucetNetworks(showNewLogo)

  const [selectedNetwork, setSelectedNetwork] = useState(faucetNetworks[0])
  const [countdown, setCountdown] = useState(secondsUntilNextDrip || 0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [blockExplorerUrl, setBlockExplorerUrl] = useState('')

  const [claimStatus, setClaimStatus] = useState<ClaimStatus>(null)

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

  const hasAuthentication = Object.values(faucetAuthentications).some(Boolean)
  const claimAmount = hasAuthentication ? 1 : 0.05

  const isValidAddress = isAddress(address)

  const isClaimDisabled =
    !authenticated || !isValidAddress || !selectedNetwork || countdown > 0

  const claimText =
    countdown > 0
      ? 'Claim limit reached'
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

  // Poll for the transaction status once the claim has been initiated.
  useEffect(() => {
    if (claimStatus === 'initiated' && secondsUntilNextDrip !== 0) {
      setClaimStatus('successful')
    }

    if (claimStatus === 'initiated') {
      const interval = setInterval(() => {
        refetchNextDrips()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [claimStatus, secondsUntilNextDrip])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setClaimStatus(null)
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
            disabled={
              countdown > 0 ||
              !authenticated ||
              unavailableNetworksChainIds.has(network.chainID)
            }
          >
            <div className="flex gap-3 items-center">
              <img
                src={network.image}
                alt={network.label}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col items-start">
                <Text as="p" className="text-base font-semibold">
                  {network.label}
                </Text>
                {unavailableNetworksChainIds.has(network.chainID) && (
                  <Text
                    as="span"
                    className="text-sm text-secondary-foreground text-left"
                  >
                    Temporarily unavailable
                  </Text>
                )}
              </div>
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
          authentications={faucetAuthentications}
          recipientAddress={address}
          onSuccess={() => {
            setClaimStatus('initiated')
          }}
          onFailed={() => {
            setClaimStatus('failed')
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
            claimStatus={claimStatus}
            blockExplorerUrl={blockExplorerUrl}
          />
        </DialogContent>
      </Dialog>
      <Confetti runAnimation={claimStatus === 'successful'} zIndex={1000} />
    </div>
  )
}

export { FaucetContent }
