import { apiClient } from '@/app/helpers/apiClient'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { Authentications } from '@/app/faucet/types'
import {
  getOnchainAuthentication,
  hasAuthentication,
} from '@/app/faucet/helpers'

const useFaucetVerifications = () => {
  const { connectedWallet } = useConnectedWallet()
  const walletAddress = connectedWallet?.address ?? ''

  // Coinbase check
  const { data: isCoinbaseVerified } =
    apiClient.auth.isCoinbaseVerified.useQuery(
      {
        address: walletAddress,
      },
      { enabled: !!walletAddress },
    )

  // World ID check
  const { data: isWorldIdUser } = apiClient.auth.isWorldIdUser.useQuery(
    undefined,
    { enabled: !!walletAddress },
  )

  // Gitcoin check
  const { data: isGitcoinVerified } =
    apiClient.auth.isCoinbaseVerified.useQuery(
      {
        address: walletAddress,
      },
      { enabled: !!walletAddress },
    )

  // EAS check
  const { data: isAttested } = apiClient.auth.isAttested.useQuery(
    {
      address: walletAddress,
    },
    { enabled: !!walletAddress },
  )

  const faucetAuthentications: Authentications = {
    COINBASE_VERIFICATION: isCoinbaseVerified,
    WORLD_ID: isWorldIdUser,
    GITCOIN_PASSPORT: isGitcoinVerified,
    ATTESTATION: isAttested,
  }

  // Get the seconds until the next faucet drip for the user
  let secondsUntilNextDrip: number | undefined

  if (!hasAuthentication(faucetAuthentications)) {
    console.log('No authentication')
    const { data: nextDrips } = apiClient.faucet.nextDrips.useQuery(
      { authMode: 'PRIVY', walletAddress: walletAddress },
      { enabled: !!walletAddress },
    )

    console.log('nextDrips', nextDrips)
    secondsUntilNextDrip = nextDrips?.secondsUntilNextDrip
  } else {
    const authMode = getOnchainAuthentication(faucetAuthentications)
    if (authMode) {
      const { data: nextDrips } = apiClient.faucet.nextDrips.useQuery(
        {
          authMode: authMode,
          walletAddress: walletAddress,
        },
        { enabled: !!walletAddress && !!authMode },
      )
      secondsUntilNextDrip = nextDrips?.secondsUntilNextDrip
    }
  }

  return { faucetAuthentications, secondsUntilNextDrip }
}

export { useFaucetVerifications }
