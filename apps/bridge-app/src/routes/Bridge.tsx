import { useOPNetwork } from '@eth-optimism/op-app'

import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@eth-optimism/ui-components'

import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { BridgeForm } from '@/components/bridge/BridgeForm'
import { NETWORK_TYPE } from '@/constants/networkType'

export type BridgeProps = {
  action: 'deposit' | 'withdrawal'
}

export const Bridge = ({ action }: BridgeProps) => {
  const navigate = useNavigate()

  const { chain } = useAccount()
  const { networkPair } = useOPNetwork({
    type: NETWORK_TYPE,
    chainId: chain?.id,
  })

  return (
    <Card className="mt-6 px-6 py-6 shadow-none border-none md:border-solid md:rounded-lg md:shadow-md">
      <Tabs defaultValue={action} className="w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" onClick={() => navigate('/deposit')}>
            Deposit
          </TabsTrigger>
          <TabsTrigger
            value="withdrawal"
            onClick={() => navigate('/withdrawal')}
          >
            Withdrawal
          </TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <CardContent className="p-0 pt-3 space-y-2">
            <BridgeForm
              l1={networkPair.l1}
              l2={networkPair.l2}
              action="deposit"
            />
          </CardContent>
        </TabsContent>
        <TabsContent value="withdrawal">
          <CardContent className="p-0 pt-3 space-y-2">
            <BridgeForm
              l1={networkPair.l1}
              l2={networkPair.l2}
              action="withdrawal"
            />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
