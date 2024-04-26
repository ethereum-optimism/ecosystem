import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts'
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless/utils'
import type { Address, Chain } from 'viem'
import { createPublicClient, http } from 'viem'
import { generatePrivateKey } from 'viem/accounts'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'

import { fraxtalSepolia } from '@/constants/fraxtalSepolia'

const factoryAddressByChainId: Record<number, Address> = {
  [optimismSepolia.id]: '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232',
  [zoraSepolia.id]: '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232',
  [fraxtalSepolia.id]: '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232',
  [baseSepolia.id]: '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232',
  [sepolia.id]: '0x9406cc6185a346906296840746125a0e44976454',
}

export const createRandomSimpleAccount = async (chain: Chain) => {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  })

  const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
    privateKey: generatePrivateKey(),
    factoryAddress: factoryAddressByChainId[chain.id],
    entryPoint: ENTRYPOINT_ADDRESS_V06,
  })

  return simpleAccount
}
