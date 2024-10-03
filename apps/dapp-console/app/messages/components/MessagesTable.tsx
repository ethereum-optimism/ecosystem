import * as React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@eth-optimism/ui-components' // Assuming these components are saved in a file named TableComponents.tsx
import { useMessages } from '@/app/hooks/useMessages'
import { StatusCell } from '@/app/messages/components/StatusCell'

const MessagesTable = () => {
  const { messages } = useMessages()

  return (
    <Table className="min-w-full bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Source Transaction</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Log Index</TableHead>
          <TableHead>Source Chain</TableHead>
          <TableHead>Destination Chain</TableHead>
          <TableHead>Destination Transaction</TableHead>
          <TableHead>Failed Transaction</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages &&
          messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <StatusCell message={message} />
              </TableCell>
              <TableCell>{message.txHash}</TableCell>
              <TableCell>{message.target}</TableCell>
              <TableCell>{message.logIndex}</TableCell>
              <TableCell>{message.chainId.toString()}</TableCell>
              <TableCell>{message.destinationChainId.toString()}</TableCell>
              <TableCell>{message.destinationTxHash}</TableCell>
              <TableCell>{message.failedTxHash}</TableCell>
              <TableCell>{formatUTCSeconds(Number(message.timestamp))}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

function formatUTCSeconds(utcSeconds: number) {
  // Convert UTC seconds to milliseconds (Date constructor expects milliseconds)
  const date = new Date(utcSeconds * 1000);

  // Format the date using the toLocaleString method
  return date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
}

export { MessagesTable }
