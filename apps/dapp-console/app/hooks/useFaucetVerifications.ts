import { apiClient } from '@/app/helpers/apiClient'
import { useConnectedWallet } from '@/app/hooks/useConnectedWallet'
import { Authentications } from '@/app/faucet/types'
import {
  getOnchainAuthentication,
  hasAuthentication,
} from '@/app/faucet/helpers'
import { usePrivy } from '@privy-io/react-auth'
import { useAuth } from '@/app/hooks/useAuth'

const useFaucetVerifications = () => {
  const { authenticated: privyAuthenticated, ready } = usePrivy()
  const { userHasGithubAuth } = useAuth()
  const { connectedWallet } = useConnectedWallet()
  const walletAddress = connectedWallet?.address ?? ''

  // Coinbase check
  const { data: isCoinbaseVerified, isFetching: isCoinbaseVerifiedLoading } =
    apiClient.auth.isCoinbaseVerified.useQuery(
      {
        address: walletAddress,
      },
      {
        enabled: !!walletAddress && !!privyAuthenticated && userHasGithubAuth,
        refetchOnWindowFocus: false,
      },
    )

  const { data: coinbaseNextDrips, refetch: refetchCoinbaseDrips } =
    apiClient.faucet.nextDrips.useQuery(
      {
        authMode: 'COINBASE_VERIFICATION',
        walletAddress: walletAddress,
      },
      {
        enabled:
          !!isCoinbaseVerified &&
          !!walletAddress &&
          !!privyAuthenticated &&
          userHasGithubAuth,
      },
    )

  // EAS check
  const { data: isAttested, isFetching: isAttestedLoading } =
    apiClient.auth.isAttested.useQuery(
      {
        address: walletAddress,
      },
      {
        enabled: !!walletAddress && !!privyAuthenticated && userHasGithubAuth,
        refetchOnWindowFocus: false,
      },
    )

  const { data: easNextDrips, refetch: refetchEasNextDrips } =
    apiClient.faucet.nextDrips.useQuery(
      {
        authMode: 'ATTESTATION',
        walletAddress: walletAddress,
      },
      {
        enabled:
          !!isAttested &&
          !!walletAddress &&
          !!privyAuthenticated &&
          userHasGithubAuth,
      },
    )

  // Gitcoin check
  const { data: isGitcoinVerified, isFetching: isGitcoinLoading } =
    apiClient.auth.isCoinbaseVerified.useQuery(
      {
        address: walletAddress,
      },
      {
        enabled: !!walletAddress && !!privyAuthenticated && userHasGithubAuth,
        refetchOnWindowFocus: false,
      },
    )

  const { data: gitcoinNextDrips, refetch: refetchGitcoinNextDrips } =
    apiClient.faucet.nextDrips.useQuery(
      {
        authMode: 'GITCOIN_PASSPORT',
        walletAddress: walletAddress,
      },
      {
        enabled:
          !!isGitcoinVerified &&
          !!walletAddress &&
          !!privyAuthenticated &&
          userHasGithubAuth,
      },
    )

  // World ID check
  const {
    data: isWorldIdUser,
    refetch: refetchWorldId,
    isFetching: isWorldIDUserLoading,
  } = apiClient.auth.isWorldIdUser.useQuery(undefined, {
    enabled: !!privyAuthenticated && userHasGithubAuth,
    refetchOnWindowFocus: false,
  })

  const { data: worldIdNextDrips, refetch: refetchWorldIdNextDrips } =
    apiClient.faucet.nextDrips.useQuery(
      {
        authMode: 'WORLD_ID',
      },
      { enabled: !!isWorldIdUser && !!privyAuthenticated && userHasGithubAuth },
    )

  const { data: nextDripsPrivy, refetch: refetchPrivyNextDrips } =
    apiClient.faucet.nextDrips.useQuery(
      {
        authMode: 'PRIVY',
      },
      { enabled: !!privyAuthenticated && userHasGithubAuth },
    )

  const isAuthenticationLoading =
    !ready ||
    isCoinbaseVerifiedLoading ||
    isAttestedLoading ||
    isGitcoinLoading ||
    isWorldIDUserLoading

  const refetchNextDrips = () => {
    if (isCoinbaseVerified) refetchCoinbaseDrips()
    if (isAttested) refetchEasNextDrips()
    if (isGitcoinVerified) refetchGitcoinNextDrips()
    if (isWorldIdUser) refetchWorldIdNextDrips()
    refetchPrivyNextDrips()
  }

  const faucetAuthentications: Authentications = {
    COINBASE_VERIFICATION: isCoinbaseVerified,
    ATTESTATION: isAttested,
    GITCOIN_PASSPORT: isGitcoinVerified,
    WORLD_ID: isWorldIdUser,
  }

  const nextDrips: Record<keyof Authentications, number> = {
    COINBASE_VERIFICATION: coinbaseNextDrips?.secondsUntilNextDrip || 0,
    ATTESTATION: easNextDrips?.secondsUntilNextDrip || 0,
    GITCOIN_PASSPORT: gitcoinNextDrips?.secondsUntilNextDrip || 0,
    WORLD_ID: worldIdNextDrips?.secondsUntilNextDrip || 0,
  }

  const onchainAuthentication = getOnchainAuthentication(faucetAuthentications)

  let secondsUntilNextDrip = 0

  if (onchainAuthentication) {
    secondsUntilNextDrip = nextDrips[onchainAuthentication]
  } else if (faucetAuthentications.WORLD_ID) {
    secondsUntilNextDrip = nextDrips.WORLD_ID
  } else {
    secondsUntilNextDrip = nextDripsPrivy?.secondsUntilNextDrip || 0
  }

  const hasOnChainAuthentication =
    hasAuthentication(faucetAuthentications) && userHasGithubAuth

  const authenticated = hasOnChainAuthentication || userHasGithubAuth

  return {
    faucetAuthentications,
    secondsUntilNextDrip,
    refetchWorldId,
    refetchNextDrips,
    isAuthenticationLoading,
    authenticated,
    hasOnChainAuthentication,
  }
}

export { useFaucetVerifications }
