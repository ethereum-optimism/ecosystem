import { ticTacToeABI } from '@/constants/contracts'
import { supersimL2A } from '@eth-optimism/viem'
import { Hash, createPublicClient, http, parseEventLogs } from 'viem'

export const gamePublicClient = createPublicClient({
  chain: supersimL2A,
  transport: http(),
})

export async function getGameId(
  hash: Hash | undefined,
): Promise<number | undefined> {
  if (!hash) {
    return
  }

  const receipt = await gamePublicClient.waitForTransactionReceipt({ hash })
  const logs = parseEventLogs({ abi: ticTacToeABI, logs: receipt.logs })
  const gameCreatedEvent = logs.find((log) => log.eventName === 'GameCreated')

  return gameCreatedEvent ? Number(gameCreatedEvent.args.gameId) : undefined
}

export function isInterop(chainId: number) {
  return chainId !== gamePublicClient.chain.id
}
