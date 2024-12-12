import {
  contracts,
  type SendSupERC20Parameters,
  type SendSuperchainWETHParameters,
} from '@eth-optimism/viem'
import { useCallback } from 'react'

import { useSendSupERC20 } from './useSendSupERC20.js'

export const useSendSuperchainWETH = () => {
  const { sendSupERC20, isError, isPending, isSuccess } = useSendSupERC20()

  const sendSuperchainWETH = useCallback(
    (params: SendSuperchainWETHParameters) => {
      const { to, amount, chainId } = params

      const sendSupERC20Params = {
        tokenAddress: contracts.superchainWETH.address,
        to,
        amount,
        chainId,
      } as unknown as SendSupERC20Parameters

      return sendSupERC20(sendSupERC20Params)
    },
    [sendSupERC20],
  )

  return { sendSuperchainWETH, isError, isPending, isSuccess }
}
