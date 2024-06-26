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
    apiClient.auth.isCoinbaseVerified.useQuery({
      address: walletAddress,
    })

  // World ID check
  const { data: isWorldIdUser, refetch: refetchWorldId } =
    apiClient.auth.isWorldIdUser.useQuery()

  // Gitcoin check
  const { data: isGitcoinVerified } =
    apiClient.auth.isCoinbaseVerified.useQuery({
      address: walletAddress,
    })

  // EAS check
  const { data: isAttested } = apiClient.auth.isAttested.useQuery({
    address: walletAddress,
  })

  const faucetAuthentications: Authentications = {
    COINBASE_VERIFICATION: isCoinbaseVerified,
    WORLD_ID: isWorldIdUser,
    GITCOIN_PASSPORT: isGitcoinVerified,
    ATTESTATION: isAttested,
  }

  const isAuthenticated = hasAuthentication(faucetAuthentications)
  const authMode = getOnchainAuthentication(faucetAuthentications)

  // Get the seconds until the next faucet drip for the user
  const { data: nextDripsPrivy } = apiClient.faucet.nextDrips.useQuery(
    {
      authMode: 'PRIVY',
      walletAddress: walletAddress || undefined,
    },
    { enabled: !isAuthenticated },
  )

  const { data: nextDripsAuthMode } = apiClient.faucet.nextDrips.useQuery(
    {
      authMode: authMode || 'PRIVY',
      walletAddress: walletAddress,
    },
    { enabled: !!authMode },
  )

  const { data: nextDripsWorldId } = apiClient.faucet.nextDrips.useQuery({
    authMode: 'WORLD_ID',
  })

  let secondsUntilNextDrip = 0
  if (nextDripsPrivy?.secondsUntilNextDrip) {
    secondsUntilNextDrip = nextDripsPrivy.secondsUntilNextDrip
  } else if (nextDripsAuthMode?.secondsUntilNextDrip) {
    secondsUntilNextDrip = nextDripsAuthMode.secondsUntilNextDrip
  } else if (nextDripsWorldId?.secondsUntilNextDrip) {
    secondsUntilNextDrip = nextDripsWorldId.secondsUntilNextDrip
  }

  return { faucetAuthentications, secondsUntilNextDrip, refetchWorldId }
}

export { useFaucetVerifications }
