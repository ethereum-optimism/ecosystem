import { apiClient } from '@/app/helpers/apiClient'

const useFaucetNetworks = () => {
  const { data: faucetsInfo } = apiClient.faucet.faucetsInfo.useQuery()

  const unavailableNetworks = faucetsInfo?.filter(
    (faucet) => faucet.isAvailable !== true,
  )

  const unavailableNetworksChainIds = new Set(
    unavailableNetworks?.map((faucet) => faucet.chainId),
  )

  return { unavailableNetworksChainIds }
}

export { useFaucetNetworks }
