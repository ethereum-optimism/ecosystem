import {
  Button,
  Card,
  CardHeader,
  Input,
  Text,
} from '@eth-optimism/ui-components'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { useCallback, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import type { Hex } from 'viem'
import { apiReact } from '@/apiClient'
import { RiLoader2Fill } from '@remixicon/react'

export const NameCard = () => {
  const { address } = useAccount()
  const [newName, setNewName] = useState<string>('')
  const [isSettingName, setIsSettingName] = useState(false)

  const faucetClaimOnMutateCallback = useCallback(() => {
    setIsSettingName(true)
  }, [setIsSettingName])

  const faucetClaimOnSettledCallback = useCallback(() => {
    setIsSettingName(false)
  }, [setIsSettingName])

  const { mutate: setNameMutate } = apiReact.name.setName.useMutation({
    onMutate: faucetClaimOnMutateCallback,
    onSettled: faucetClaimOnSettledCallback,
  })
  const onSignedMessageSuccess = useCallback(
    (data: Hex) => {
      address &&
        setNameMutate({
          name: `${newName}.ecopod.eth`,
          owner: address,
          addresses: {
            [60]: address,
          },
          signature: {
            hash: data,
            message: `Sign a message to prove you are the owner of this account`,
          },
        })
    },
    [address, newName, setNameMutate],
  )

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: onSignedMessageSuccess,
    },
  })

  return (
    <Card className="p-6">
      <CardHeader className={cn('pb-1 flex-row items-start')}>
        <Text as="span" className="text-base font-semibold flex-1">
          Register as an ecopod engineer (ecopod.eth)
        </Text>
      </CardHeader>
      <div className="flex flex-col w-full justify-between my-2 gap-4">
        <Input
          className={cn(['mt-2', 'w-full'])}
          autoFocus={true}
          maxLength={80}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            signMessage({
              message: `Sign a message to prove you are the owner of this account`,
            })
          }
        >
          {isSettingName && (
            <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register name
        </Button>
      </div>
    </Card>
  )
}
