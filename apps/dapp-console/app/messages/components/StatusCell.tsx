import { useCallback, useEffect, useRef, useState } from 'react'
import { XChainMessage } from '@/app/types/api'
import { Badge } from '@eth-optimism/ui-components'
import { usePrivy } from '@privy-io/react-auth'
import {
  useConnectedWallet,
  useConnectedChainId,
} from '@/app/hooks/useConnectedWallet'
import { useExecuteL2ToL2CDMMessage } from '@/app/hooks/useExecuteL2toL2CDMMessage'

const StatusCell = ({ message }: { message: XChainMessage }) => {
  const { connectWallet } = usePrivy()
  const { connectedWallet } = useConnectedWallet()
  const { chainId } = useConnectedChainId()
  const { executeMessage } = useExecuteL2ToL2CDMMessage()
  const [isWaitingForReceipt, setIsWaitingForReceipt] = useState<boolean>(false)

  const prevStatusRef = useRef<string | undefined>(undefined)

  const switchToDestination = useCallback(async () => {
    await connectedWallet?.switchChain(Number(message.destinationChainId))
  }, [message.destinationChainId, connectedWallet])

  useEffect(() => {
    // Check if the status has changed from its previous value
    if (prevStatusRef.current && prevStatusRef.current !== message.status) {
      // If the status changes, set isWaitingForReceipt to false
      setIsWaitingForReceipt(false)
    }

    // Update the previous status reference to the current status
    prevStatusRef.current = message.status
  }, [message.status])

  const relayMessage = useCallback(async () => {
    if (message.status == 'relayed') {
      throw new Error(
        `Status must be pending or failed, current status: ${message.status}`,
      )
    }

    const messageIdentifier = {
      /** Account that emits the SendMessage log in L2ToL2CrossDomainMessenger. */
      origin: message.origin,
      /** Block number in which the log was emitted */
      blockNumber: message.blockNumber,
      /** The index of the log in the array of all logs emitted in the block */
      logIndex: BigInt(message.logIndex),
      /** The timestamp that the log was emitted. Used to enforce the timestamp invariant */
      timestamp: message.timestamp,
      /** The chain id of the chain that emitted the log */
      chainId: message.chainId,
    }
    try {
      setIsWaitingForReceipt(true)
      await executeMessage({
        id: messageIdentifier,
        message: message.messagePayload,
      })
    } catch (e) {
      console.log(e)
    }
  }, [message, executeMessage])

  if (isWaitingForReceipt) {
    return <Badge variant="outline">Executing message...</Badge>
  }

  if (message.status === 'pending' || message.status === 'failed') {
    if (!connectedWallet) {
      return (
        <Badge
          variant="outline"
          onClick={connectWallet}
          clickable
        >
          <span>Connect wallet to relay</span>
        </Badge>
      )
    }

    if (chainId !== Number(message.destinationChainId)) {
      return (
        <Badge
        variant="outline"
          onClick={switchToDestination}
          clickable
        >
          <span>{`Switch to ${message.destinationChainId} to relay`}</span>
        </Badge>
      )
    }

    if (message.status === 'failed') {
      return (
        <Badge
          variant="destructive"
          onClick={relayMessage}
          clickable
        >
          <span>Relay failed, try again?</span>
        </Badge>
      )
    }

    return (
      <Badge
        variant="outline"
        onClick={relayMessage}
        clickable
      >
        <span>Relay message</span>
      </Badge>
    )
  }

  return <Badge variant="success">{message.status}</Badge>
}

export { StatusCell }
