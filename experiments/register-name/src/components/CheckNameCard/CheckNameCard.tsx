import { Card, CardHeader, Input, Text } from '@eth-optimism/ui-components'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { RiLoader2Fill } from '@remixicon/react'
import { useState } from 'react'
import { useEnsAddress } from 'wagmi'

export const CheckNameCard = () => {
  const [newName, setNewName] = useState<string>('')
  const [nameToCheck, setNameToCheck] = useState<string | undefined>(undefined)
  const { data, isFetching } = useEnsAddress({
    name: nameToCheck,
    chainId: 11155111,
    query: {
      enabled: !!nameToCheck,
    },
  })

  return (
    <Card className="p-6">
      <CardHeader className={cn('pb-1 flex-row items-start')}>
        <Text as="span" className="text-base font-semibold flex-1">
          Check name
        </Text>
      </CardHeader>
      <div className="flex flex-col w-full justify-between my-2 gap-4">
        <Input
          className={cn(['mt-2', 'w-full'])}
          maxLength={80}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => setNameToCheck(newName)}
        />
        {isFetching && <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />}
        {!isFetching && (data === null || !!data) && (
          <Text>
            {data ? `Resolved address: ${data}` : 'Name is not registered'}
          </Text>
        )}
      </div>
    </Card>
  )
}
