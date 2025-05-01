import type { Hono } from 'hono'
import type { ReadonlyDrizzle } from 'ponder'
import { and, count, eq, inArray, isNull, replaceBigInts } from 'ponder'
import { isAddress } from 'viem'

import type { createInteropSchema } from './createInteropSchema.js'

type schema = ReturnType<typeof createInteropSchema>

export class PonderApi {
  private app: Hono
  private limit: number
  private chains: Array<{ id: number; name: string; url: string }>
  private chainIds: bigint[]
  private schema: schema
  private db: ReadonlyDrizzle<schema>
  constructor(
    app: Hono,
    schema: schema,
    chains: Array<{ id: number; name: string; url: string }>,
    db: ReadonlyDrizzle<schema>,
    limit: number,
  ) {
    this.app = app
    this.schema = schema
    this.chains = chains
    this.chainIds = this.chains.map((c) => BigInt(c.id))
    this.db = db
    this.limit = limit
    this.setupRoutes()
  }

  private setupRoutes() {
    // List of interoperable chains
    this.app.get('/chains', async (c) => {
      return c.json(this.chains)
    })

    // Count of all messages
    this.app.get('/messages/count', async (c) => {
      const sent = await this.db
        .select({ count: count() })
        .from(this.schema.sentMessages)
        .where(inArray(this.schema.sentMessages.destination, this.chainIds))

      const relayed = await this.db
        .select({ count: count() })
        .from(this.schema.relayedMessages)

      let pending = undefined
      if (sent.length > 0 && sent.length === relayed.length) {
        pending = sent[0]!.count - relayed[0]!.count
      }

      return c.json({ sent, relayed, pending })
    })

    // List of pending messages
    this.app.get('/messages/pending', async (c) => {
      const result = await this.db
        .select()
        .from(this.schema.sentMessages)
        .limit(this.limit)
        .leftJoin(
          this.schema.relayedMessages,
          eq(
            this.schema.sentMessages.messageHash,
            this.schema.relayedMessages.messageHash,
          ),
        )
        .where(isNull(this.schema.relayedMessages.messageHash))

      const messages = result
        .map((m) => m.l2_to_l2_cdm_sent_messages)
        .map((m) => replaceBigInts(m, (x) => Number(x)))

      return c.json(messages)
    })

    // List of pending messages for an account
    this.app.get('/messages/:account/pending', async (c) => {
      const account = c.req.param('account').toLowerCase()
      if (!account || !isAddress(account)) {
        return c.json({ error: 'Invalid account' }, 400)
      }

      const result = await this.db
        .select()
        .from(this.schema.sentMessages)
        .limit(this.limit)
        .leftJoin(
          this.schema.relayedMessages,
          eq(
            this.schema.sentMessages.messageHash,
            this.schema.relayedMessages.messageHash,
          ),
        )
        .where(
          and(
            isNull(this.schema.relayedMessages.messageHash),
            eq(this.schema.sentMessages.sender, account),
          ),
        )

      const messages = result
        .map((m) => m.l2_to_l2_cdm_sent_messages)
        .map((m) => replaceBigInts(m, (x) => Number(x)))

      return c.json(messages)
    })
  }
}
