import { AddressSchema } from '@superchain-tools/common-ts'
import { useQuery } from '@tanstack/react-query'
import { Abi as AbiSchema } from 'abitype/zod'
import type { Address } from 'viem'
import { z } from 'zod'

import { envVars } from '@/envVars'

const ContractMetadataSchema = z
  .object({
    source: z.enum(['etherscan', 'blockscout'] as const),
    abi: AbiSchema,
    implementationAddress: AddressSchema.nullable(),
    name: z.string().nullable(),
  })
  .nullable()

const getContractMetadataAbiQueryKey = ({
  chainId,
  address,
}: {
  chainId: number
  address: Address
}) => {
  return ['ContractMetadata', chainId, address]
}

export const getContractMetadata = async ({
  chainId,
  address,
}: {
  chainId: number
  address: Address
}) => {
  const result = await fetch(
    `${envVars.VITE_CONTRACT_LOOKUP_SERVICE_URL}/contract-metadata/${chainId}/${address}`,
  )
  console.log('hello', result)
  if (result.status === 404) {
    return null
  }
  return ContractMetadataSchema.parse(await result.json())
}

export const useContractMetadata = ({
  chainId,
  address,
}: {
  chainId?: number
  address?: Address
}) => {
  return useQuery({
    queryKey:
      chainId && address
        ? getContractMetadataAbiQueryKey({ chainId, address })
        : [],
    queryFn: () =>
      getContractMetadata({
        chainId: chainId!,
        address: address!,
      }),
    enabled: Boolean(address && chainId),
    staleTime: 6000_000,
  })
}
