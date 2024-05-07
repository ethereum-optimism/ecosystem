import {
  ConnectedWallet,
  useConnectWallet,
  useWallets,
} from '@privy-io/react-auth'
import { useContractVerification } from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ToastAction,
  toast,
} from '@eth-optimism/ui-components'
import { shortenAddress } from '@eth-optimism/op-app'
import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import { RiLoader4Line } from '@remixicon/react'

export const BeginContent = () => {
  const { contract, setSigningType, goNext, setWallet, setChallenge } =
    useContractVerification()
  const { wallets } = useWallets()

  const [isLoadingManual, setLoadingManual] = useState(false)
  const [isLoadingAutomatic, setLoadingAutomatic] = useState(false)

  const {
    mutateAsync: startVerification,
    isLoading: isStartVerificationLoading,
  } = apiClient.Contracts.startVerification.useMutation()

  const connectedWallet = useMemo(() => {
    const foundWallets = wallets.filter(
      (wallet) =>
        wallet.address.toLowerCase() === contract.deployerAddress.toLowerCase(),
    )
    return foundWallets[0]
  }, [wallets, contract])

  const handleSuccessfulWalletConnection = useCallback(
    (wallet: ConnectedWallet) => {
      setWallet(wallet)
      goNext()
    },
    [goNext, setSigningType],
  )

  const handleSetChallenge = useCallback(
    async (retryFunc: () => void) => {
      try {
        const challengeToSign = await startVerification({
          contractId: contract.id,
        })
        setChallenge(challengeToSign)
        return challengeToSign
      } catch (e) {
        captureError(e, 'startContractVerification')

        toast({
          description: `Your request timed out.`,
          action: (
            <ToastAction altText="Retry Fetching Challenge" onClick={retryFunc}>
              Retry
            </ToastAction>
          ),
        })
      }
    },
    [startVerification, setChallenge, toast],
  )

  const handleManualClick = useCallback(async () => {
    setLoadingManual(true)
    setLoadingAutomatic(false)

    setSigningType('manual')
    const challenge = await handleSetChallenge(handleManualClick)
    if (challenge) {
      goNext()
    }
  }, [goNext, setSigningType, handleSetChallenge])

  const handleAutomaticClick = useCallback(async () => {
    setLoadingAutomatic(true)
    setLoadingManual(false)

    setSigningType('automatic')

    const challenge = await handleSetChallenge(handleAutomaticClick)
    if (!challenge) {
      return
    }

    if (!connectedWallet) {
      connectWallet()
    } else {
      setWallet(connectedWallet)
      goNext()
    }
  }, [goNext, connectedWallet, setSigningType, handleSetChallenge])

  const { connectWallet } = useConnectWallet({
    onSuccess: (wallet) =>
      handleSuccessfulWalletConnection(wallet as ConnectedWallet),
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">
          Verify Contract Ownership
        </DialogTitle>
        {contract.contractAddress && (
          <DialogDescription className="text-center">
            {shortenAddress(contract.contractAddress)}
          </DialogDescription>
        )}
      </DialogHeader>
      <Button onClick={handleManualClick}>
        {isLoadingManual && isStartVerificationLoading ? (
          <RiLoader4Line className="ml-2 animate-spin" />
        ) : (
          'Verify Manually'
        )}
      </Button>
      <Button variant="outline" onClick={handleAutomaticClick}>
        {isLoadingAutomatic && isStartVerificationLoading ? (
          <RiLoader4Line className="ml-2 animate-spin" />
        ) : (
          'Connect Wallet'
        )}
      </Button>
    </>
  )
}
