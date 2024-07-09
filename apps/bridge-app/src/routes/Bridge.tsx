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
    <Card className="pt-6">
      <CardContent>
        <Tabs defaultValue={action} className="w-[500px]">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger
              value="deposit"
              onClick={() => navigate('/bridge/deposit')}
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              onClick={() => navigate('/bridge/withdraw')}
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
      </CardContent>
    </Card>
  )
}
