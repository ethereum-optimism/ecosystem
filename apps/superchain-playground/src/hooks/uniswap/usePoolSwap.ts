import type { Address } from 'viem'
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { v4QuoterAbi } from '@/constants/v4QuoterAbi'
import { V4_QUOTER_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId } from '@/hooks/uniswap/poolKey'

export const usePoolSwap = ({
  sellToken,
  buyToken,
  amountIn,
}: {
  sellToken: Address
  buyToken: Address
  amountIn: number
}) => {
  const { poolKey } = getPoolId({ buyToken, sellToken })
  const zeroForOne = sellToken === poolKey.currency0
  const swapParams = {
    zeroForOne,
    amountSpecified: BigInt(amountIn),
    sqrtPriceLimitX96: 0n,
  }

  const { data, error: simulationError } = useSimulateContract({
    address: V4_QUOTER_ADDRESS,
    abi: v4QuoterAbi,
    functionName: 'quoteExactInputSingle',
    args: [
      {
        poolKey,
        zeroForOne,
        exactAmount: swapParams.amountSpecified,
        hookData: '0x',
      },
    ],
  })

  const estimatedAmountOut = data?.result?.[0]

  if (simulationError) {
    console.error(`ERROR V4 QUOTE SIMULATION: ${simulationError}`)
  }
  if (data?.result) {
    console.log(`QUOTE: ${data.result}`)
  }

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })
  if (writeError) {
    console.error(`ERROR SWAPROUTER WRITE: ${writeError}`)
  }

  const swap = () => {
    if (!estimatedAmountOut) {
      console.error('SWAP WITH NO DATA')
      return
    }

    //writeContract({
    //  address: SWAPROUTER_ADDRESS,
    //  abi: swapRouterAbi,
    //  functionName: 'swap',
    //  args: [poolKey, swapParams],
    //})
  }

  return { swap, estimatedAmountOut, isPending: isPending || isConfirming }
}
