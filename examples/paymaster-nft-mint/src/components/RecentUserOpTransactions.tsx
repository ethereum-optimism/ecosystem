import { CopiableHash } from '@/components/CopiableHash'
import { formatDistanceToNow } from 'date-fns'
import {
  getUserOperationTransactionKey,
  useUserOperationTransactions,
} from '@/state/UserOperationTransactionsState'
import { truncateHash } from '@/utils/truncateHash'
import { UserOperationRequest } from '@alchemy/aa-core'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import JSONPretty from 'react-json-pretty'
import { Hex } from 'viem'

const RecentUserOperationItem = ({
  userOpTransaction,
}: {
  userOpTransaction: {
    transactionHash: Hex
    userOpHash: Hex
    userOp: UserOperationRequest
    addedAt: number
  }
}) => {
  const { transactionHash, userOpHash, userOp, addedAt } = userOpTransaction
  return (
    <AccordionItem key={transactionHash} value={transactionHash}>
      <AccordionTrigger className="font-mono flex hover:no-underline no-underline">
        <div className="flex-1 flex justify-between pr-1">
          {truncateHash(transactionHash)}
          <Badge variant="secondary">{formatDistanceToNow(addedAt)} ago</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Transaction hash</div>
          <CopiableHash
            href={`https://www.onceupon.gg/${transactionHash}`}
            hash={transactionHash}
          />
        </div>
        <div className="flex flex-col  gap-1">
          <div className="font-semibold">User operation hash</div>
          <CopiableHash hash={userOpHash} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold">User operation</div>
          <div className="overflow-scroll">
            <JSONPretty data={userOp} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export const RecentUserOpTransactions = ({
  accountAddress,
  chainId,
}: {
  accountAddress: Hex
  chainId: number
}) => {
  const { userOpTransactionByAddressChainId } = useUserOperationTransactions()

  console.log(userOpTransactionByAddressChainId)
  const userOpTransactions =
    userOpTransactionByAddressChainId[
      getUserOperationTransactionKey(chainId, accountAddress)
    ] || []

  return (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent transactions</CardTitle>
        <CardDescription>View the user operation details</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Accordion type="single" collapsible className="w-full">
          {userOpTransactions.map((userOpTransaction) => (
            <RecentUserOperationItem
              key={userOpTransaction.transactionHash}
              userOpTransaction={userOpTransaction}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
