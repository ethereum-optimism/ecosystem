import { Connector, useChainId, useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const ConnectButton = () => {
  const chainId = useChainId()
  const { connect, connectors } = useConnect()

  const onConnect = useCallback(
    (connector: Connector) => {
      connect({ connector, chainId: chainId })
    },
    [connect, chainId],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Connect a Wallet</DialogTitle>

          <DialogDescription>
            {connectors.map((connector) => {
              return (
                <div
                  key={connector.uid}
                  className="flex flex-row px-3 py-3"
                  onClick={() => onConnect(connector)}
                >
                  <p>{connector.name}</p>
                </div>
              )
            })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
