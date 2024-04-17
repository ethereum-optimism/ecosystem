import {
  ConnectedWallet,
  useConnectWallet,
  useWallets,
} from '@privy-io/react-auth'
import { useContractVerification } from '@/app/settings/contracts/StartVerificationDialog/ContractVerificationProvider'
import { useCallback, useMemo } from 'react'
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@eth-optimism/ui-components'
import { shortenAddress } from '@eth-optimism/op-app'

export const BeginContent = () => {
  const { contract, setSigningType, goNext, setWallet } =
    useContractVerification()
  const { wallets } = useWallets()

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

  const handleManualClick = useCallback(() => {
    setSigningType('manual')
    goNext()
  }, [goNext, setSigningType])

  const handleAutomaticClick = useCallback(() => {
    setSigningType('automatic')

    if (!connectedWallet) {
      connectWallet()
    } else {
      setWallet(connectedWallet)
      goNext()
    }
  }, [goNext, connectedWallet, setSigningType])

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
      <Button onClick={handleManualClick}>Verify Manually</Button>
      <Button variant="outline" onClick={handleAutomaticClick}>
        Connect Wallet
      </Button>
    </>
  )
}
