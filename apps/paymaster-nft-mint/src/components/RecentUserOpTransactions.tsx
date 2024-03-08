import { CopiableHash } from '@/components/CopiableHash'
import { formatDistanceToNow } from 'date-fns'
import {
  getSmartAccountTransactionKey,
  useSmartAccountTransactionHashes,
} from '@/state/SmartAccountTransactionHashesState'
import { truncateHash } from '@/utils/truncateHash'
import { useBlock, useTransactionReceipt } from 'wagmi'

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
  Skeleton,
} from '@eth-optimism/ui-components'
import JSONPretty from 'react-json-pretty'
import { Hex, parseAbiItem, parseEventLogs, TransactionReceipt } from 'viem'
import { useGetUserOperationByHash } from '@/hooks/useGetUserOperationByHash'
import { deepHexlify } from 'permissionless'

const getUserOpHashFromTransactionLogs = (logs: TransactionReceipt['logs']) => {
  const parsedLogs = parseEventLogs({
    abi: [
      parseAbiItem(
        'event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)',
      ),
    ],

    logs,
  })
  return parsedLogs[0]?.args.userOpHash || null
}

const TimestampDisplay = ({ blockNumber }: { blockNumber?: bigint }) => {
  const { data: getBlockResult, isLoading: isGetBlockResultLoading } = useBlock(
    {
      blockNumber: blockNumber,
      query: {
        enabled: Boolean(blockNumber),
      },
    },
  )

  if (isGetBlockResultLoading || !getBlockResult) {
    return <Skeleton className="h-[1rem] w-[6rem]" />
  }

  return (
    <Badge variant="secondary">
      {formatDistanceToNow(Number(getBlockResult.timestamp) * 1000)} ago
    </Badge>
  )
}

const RecentUserOperationItem = ({
  transactionHash,
}: {
  transactionHash: Hex
}) => {
  const {
    data: transactionReceipt,
    isLoading: isGetTransactionReceiptLoading,
  } = useTransactionReceipt({
    hash: transactionHash,
  })
  const userOpHash = getUserOpHashFromTransactionLogs(
    transactionReceipt?.logs || [],
  )
  const {
    data: getUserOperationByHashResult,
    isLoading: isGetUserOperationLoading,
  } = useGetUserOperationByHash(userOpHash)

  const userOperation = getUserOperationByHashResult?.userOperation

  return (
    <AccordionItem key={transactionHash} value={transactionHash}>
      <AccordionTrigger className="font-mono flex hover:no-underline no-underline">
        <div className="flex-1 flex justify-between pr-1">
          {truncateHash(transactionHash)}
          <TimestampDisplay blockNumber={transactionReceipt?.blockNumber} />
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
            <JSONPretty data={deepHexlify(userOperation)} />
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
  const { transactionHashesByAddressChainId } =
    useSmartAccountTransactionHashes()

  const txHashes =
    transactionHashesByAddressChainId[
      getSmartAccountTransactionKey(chainId, accountAddress)
    ] || []

  return (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent transactions</CardTitle>
        <CardDescription>View the user operation details</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Accordion type="single" collapsible className="w-full">
          {txHashes.map((hash) => (
            <RecentUserOperationItem key={hash} transactionHash={hash} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
