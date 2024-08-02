# Interop Flow Example

This snippet of code will demo how to send a cross chain L2 to L2 message between optimism & base.

```ts [example.ts]
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { optimism, base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { publicActionsL2, walletActionsL2, extractMessageIdentifierFromLogs } from '@eth-optimism/viem'

import { TIC_TAC_TOE_ADDRES, ticTacToeABI } from './tictactoe'

const account = privateKeyToAccount('0x...')

// configure op clients
export const opPublicClient = createPublicClient({
  chain: optimism,
  transport: http(),
}).extend(publicActionsL2())

export const opWalletClient = createPublicClient({
  chain: base,
  transport: http(),
}).extend(walletActionsL2())

// configure base clients
export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
}).extend(publicActionsL2())

export const baseWalletClient = createPublicClient({
  account,
  chain: base,
  transport: http(),
}).extend(walletActionsL2())

// initiates a L2 to L2 message
const encodedMessage = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [account.address],
}),

const sendArgs = await opPublicClient.buildSendL2ToL2Message({
  destinationChainId: base.id,
  target: TIC_TAC_TOE_ADDRESS,
  message: encodedMessage,
})

const hash = await opWalletClient.sendL2ToL2Message(sendArgs)
const receipt = await opPublicClient.waitForTransactionReceipt({ hash })

// Grab MessageIdentifier from logs
const id = await extractMessageIdentifierFromLogs(opPublicClient, { receipt })

// execute the L2 to L2 message
const executeArgs = await basePublicClient.buildExecuteL2ToL2Message({
    id,
    account,
    target: ticTacToeAddress,
    message: encodedMessage,
})

await baseWalletClient.executeL2ToL2Message(executeArgs)

```