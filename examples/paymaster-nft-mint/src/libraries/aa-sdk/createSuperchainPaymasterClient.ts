import { SuperchainPaymasterClient } from '@/libraries/aa-sdk/types'
import { UserOperationRequest } from '@alchemy/aa-core'
import { Address, Chain, Client, Transport, createClient, http } from 'viem'

const superchainPaymasterClientActions = (client: Client) => {
  const clientAdapter = client as SuperchainPaymasterClient

  return {
    sponsorUserOperation: async (
      request: UserOperationRequest,
      entryPoint: string,
    ) => {
      return await clientAdapter.request({
        method: 'pm_sponsorUserOperation',
        params: [request, entryPoint as Address],
      })
    },
  }
}

export const createSuperchainPaymasterClient = ({
  paymasterRpcUrl,
  chain,
}: {
  paymasterRpcUrl: string
  chain: Chain
}): SuperchainPaymasterClient<Transport, Chain> => {
  return createClient({
    chain: chain,
    transport: http(paymasterRpcUrl),
  }).extend(superchainPaymasterClientActions)
}
