import {
  contracts,
  type SendSuperchainERC20Parameters,
  type SendSuperchainWETHParameters,
} from '@eth-optimism/viem'
import { useCallback } from 'react'

import { useSendSuperchainERC20 } from './useSendSuperchainERC20.js'

export const useSendSuperchainWETH = () => {
  const { sendSuperchainERC20, isError, isPending, isSuccess } =
    useSendSuperchainERC20()

  const sendSuperchainWETH = useCallback(
    (params: SendSuperchainWETHParameters) => {
      const { to, amount, chainId } = params

      const sendSuperchainERC20Params = {
        tokenAddress: contracts.superchainWETH.address,
        to,
        amount,
        chainId,
      } as unknown as SendSuperchainERC20Parameters

      return sendSuperchainERC20(sendSuperchainERC20Params)
    },
    [sendSuperchainERC20],
  )

  return { sendSuperchainWETH, isError, isPending, isSuccess }
}
