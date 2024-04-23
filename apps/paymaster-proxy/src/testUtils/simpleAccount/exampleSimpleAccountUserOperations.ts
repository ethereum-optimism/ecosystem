import { type Chain, encodeFunctionData } from 'viem'

import { getRandomAddress } from '@/testUtils/getRandomAddress'
import { getUserOperationWithRandomSimpleAccount } from '@/testUtils/simpleAccount/getUserOperationWithRandomSimpleAccount'
import { simpleNftAbi } from '@/testUtils/simpleNft/simpleNftAbi'
import { simpleNftAddress } from '@/testUtils/simpleNft/simpleNftAddress'

export const getMintUserOperationWithRandomSimpleAccount = async (
  chain: Chain,
) => {
  return await getUserOperationWithRandomSimpleAccount(
    chain,
    simpleNftAddress,
    encodeFunctionData({
      abi: simpleNftAbi,
      functionName: 'mint',
    }),
  )
}

export const getRevertingUserOperationWithRandomSimpleAccount = async (
  chain: Chain,
) => {
  return await getUserOperationWithRandomSimpleAccount(
    chain,
    simpleNftAddress,
    encodeFunctionData({
      abi: simpleNftAbi,
      functionName: 'transferFrom',
      args: [getRandomAddress(), getRandomAddress(), BigInt(15)],
    }),
  )
}
