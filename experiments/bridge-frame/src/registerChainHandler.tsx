import type { Frog } from 'frog'
import { Button } from 'frog'
import { type Address, parseEther } from 'viem'

import { l1StandardBridgeAbi } from '@/constants/l1StandardBridgeAbi'
import { supportedAmounts } from '@/constants/supportedAmounts'
import {
  getChainConfigForId,
  type SupportedL2Chains,
} from '@/constants/supportedChains'
import type { Env } from '@/env'
import { getDepositTxL2TransactionState } from '@/helpers/getDepositTxL2TransactionState'
import { getLoadingStatusScreen } from '@/helpers/getLoadingStatusScreen'
import { withFrameVerification } from '@/middlewares/withFrameVerification'
import { hexSchema } from '@/schemas/hexSchema'
import { BaseScreen } from '@/screens/BaseScreen'
import { ChainScreen } from '@/screens/ChainScreen'
import { DepositStatusScreen } from '@/screens/DepositStatusScreen'
import type { State } from '@/state'
import { getChainTxLink } from '@/util/getChainTxLink'
import { getSourceChain } from '@/util/getSourceChain'

export const registerChainHandler = (
  app: Frog<{ Bindings: Env; State: State }>,
  chain: SupportedL2Chains[number],
) => {
  const sourceChain = getSourceChain(chain)

  const basePath = `${chain.id}`

  app.frame(basePath, (c) => {
    // If user got here from the chain selector screen, they should be able to return to it
    const showBackOption = c.status === 'response'

    return c.res({
      image: (
        <ChainScreen
          name={chain.name}
          splashImageSrc={getChainConfigForId(c.env, chain.id).splashImageSrc!}
        />
      ),

      intents: [
        showBackOption && (
          <Button action="/" value="back">
            🔙
          </Button>
        ),
        ...supportedAmounts.map((amount) => (
          <Button.Transaction
            target={`/${basePath}/bridge/${amount}`}
            action={`/${basePath}/bridge/${amount}/submitted`}
          >
            {amount} ETH
          </Button.Transaction>
        )),
      ].filter(Boolean),
    })
  })

  app.transaction(
    `${basePath}/bridge/:amountInEth`,
    withFrameVerification,
    (c) => {
      const amountInEth = c.req.param('amountInEth')
      const amount = parseEther(amountInEth)
      return c.contract({
        abi: l1StandardBridgeAbi,
        to: chain.contracts.l1StandardBridge[chain.sourceId].address,
        chainId: `eip155:${chain.sourceId}`,
        functionName: 'bridgeETHTo',
        value: amount,
        // Hardcoded gas value
        args: [c.address as Address, 50000, '0x'],
      })
    },
  )

  app.frame(
    `${basePath}/bridge/:amountInEth/submitted`,
    withFrameVerification,
    (c) => {
      const { transactionId } = c

      const amountInEth = c.req.param('amountInEth')

      const transactionHashParseResult = hexSchema.safeParse(transactionId)

      if (!transactionHashParseResult.success) {
        return c.res({
          image: <BaseScreen>Invalid transaction hash</BaseScreen>,
        })
      }

      return c.res({
        action: `/${basePath}/tx/${transactionId}`,
        image: (
          <DepositStatusScreen
            primaryText={`Starting ${amountInEth} ETH deposit`}
            secondaryText="Confirming on Mainnet..."
          />
        ),
        intents: [
          <Button>Refresh</Button>,
          <Button.Link
            href={getChainTxLink(sourceChain, transactionHashParseResult.data)}
          >
            View {sourceChain.name} tx
          </Button.Link>,
        ],
      })
    },
  )

  // Deposit transaction status
  app.frame(`${basePath}/tx/:transactionHash`, async (c) => {
    const transactionHashParam = c.req.param('transactionHash')

    const transactionHashParseResult = hexSchema.safeParse(transactionHashParam)
    if (!transactionHashParseResult.success) {
      return c.res({
        action: '/',
        image: <BaseScreen>Invalid transaction hash</BaseScreen>,
        intents: <Button.Reset>Try again</Button.Reset>,
      })
    }

    const l1TransactionHash = transactionHashParseResult.data

    const { l1TransactionReceipt, l2TransactionReceipt } =
      await getDepositTxL2TransactionState(c.env, {
        l1ChainId: chain.sourceId,
        l2ChainId: chain.id,
        l1TransactionHash: transactionHashParseResult.data,
      })

    // Bridging completed!
    if (l1TransactionReceipt && l2TransactionReceipt) {
      return c.res({
        image: <DepositStatusScreen primaryText="Deposit successful!" />,
        intents: [
          <Button.Link
            href={getChainTxLink(
              sourceChain,
              l1TransactionReceipt.transactionHash,
            )}
          >
            View {sourceChain.name} tx
          </Button.Link>,
          <Button.Link
            href={getChainTxLink(chain, l2TransactionReceipt.transactionHash)}
          >
            View {chain.name} tx
          </Button.Link>,
        ],
      })
    }

    // Still loading
    return c.res({
      image: await getLoadingStatusScreen(c.env, {
        chain,
        l1TransactionReceipt,
      }),
      intents: [
        <Button>Refresh</Button>,
        <Button.Link href={getChainTxLink(sourceChain, l1TransactionHash)}>
          View {sourceChain.name} tx
        </Button.Link>,
      ],
    })
  })

  return app
}
