import type {
  Account,
  Chain,
  Hash,
  PublicClient,
  Transport,
  WalletClient,
} from 'viem'

import type { Trpc } from '../../Trpc'
import { Route } from '../Route'

export class FaucetAdminRoute extends Route {
  public readonly name = 'faucetAdmin' as const

  /**
   * Flushes stuck transactions from the admin wallet.
   * @param input
   * `gasPaddingFactor` (optional): A number used to increase the priority fee for the
   * transactions. Default value is `10` if not provided.
   * @returns The list of flushed transaction hashes.
   */
  public readonly flushStuckTxs = 'flushStuckTxs' as const
  public readonly flushStuckTxsController = this.trpc.procedure
    .input(this.z.object({ gasPaddingFactor: this.z.number().optional() }))
    .mutation(async ({ input }) => {
      const pendingNonce = await this.publicClient.getTransactionCount({
        address: this.adminWalletClient.account.address,
        blockTag: 'pending',
      })
      const currentNonce = await this.publicClient.getTransactionCount({
        address: this.adminWalletClient.account.address,
        blockTag: 'latest',
      })
      const nonceGap = pendingNonce - currentNonce
      this.logger?.info(`Flushing ${nonceGap} stuck transactions`)
      const flushedTxs: Hash[] = []
      try {
        for (let i = 0; i < nonceGap; i++) {
          const { maxPriorityFeePerGas } =
            await this.publicClient.estimateFeesPerGas()
          const nonce = await this.publicClient.getTransactionCount({
            address: this.adminWalletClient.account.address,
          })
          if (nonce >= pendingNonce) {
            this.logger?.info(`No more stuck transactions found`)
            break
          }

          const tx = await this.adminWalletClient.sendTransaction({
            to: this.adminWalletClient.account.address,
            value: 0n,
            nonce: nonce,
            maxPriorityFeePerGas:
              maxPriorityFeePerGas &&
              maxPriorityFeePerGas * BigInt(input.gasPaddingFactor ?? 10),
          })
          this.logger?.info(`Sent transaction ${i + 1} of ${nonceGap}`)
          await this.publicClient.waitForTransactionReceipt({
            hash: tx,
          })
          this.logger?.info(`Flushed transaction ${i + 1} of ${nonceGap}`)
          flushedTxs.push(tx)
        }
      } catch (err) {
        this.logger?.error(`Error flushing transactions: ${err.message}`)
        return {
          flushedTxs,
          error: err.message,
        }
      }
      return {
        flushedTxs,
        error: null,
      }
    })

  public readonly handler = this.trpc.router({
    [this.flushStuckTxs]: this.flushStuckTxsController,
  })

  constructor(
    trpc: Trpc,
    private readonly publicClient: PublicClient,
    private readonly adminWalletClient: WalletClient<Transport, Chain, Account>,
  ) {
    super(trpc)
  }
}
