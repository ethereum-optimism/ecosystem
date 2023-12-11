import { Card, CardContent } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Deposit } from '@/components/bridge/Deposit'
import { Withdrawal } from '@/components/bridge/Withdrawal'

export type BridgeProps = {
  action: 'deposit' | 'withdrawal'
}

const classNames = {
  cardContent: 'p-0 py-3 space-y-2',
}

export const Bridge = ({ action }: BridgeProps) => {
  return (
    <Card className="mt-6 px-6 py-6 shadow-none border-none md:border-solid md:rounded-lg md:shadow-md">
      <Tabs defaultValue={action} className="w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <CardContent className={classNames.cardContent}>
            <Deposit />
          </CardContent>
        </TabsContent>
        <TabsContent value="withdrawal">
          <CardContent className={classNames.cardContent}>
            <Withdrawal />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
