import { apiClient } from '@/app/helpers/apiClient'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { Authentications } from '@/app/faucet/types'

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

  return { faucetAuthentications }
}

export { useFaucetVerifications }
