import { type ApiContext, ponder } from '@/generated'
import { trpcServer } from '@hono/trpc-server'
import { desc } from '@ponder/core'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<ApiContext>().create({
  transformer: superjson,
})

const appRouter = t.router({
  allXChainMessages: t.procedure.query(async ({ ctx }) => {
    const { XChainMessage } = ctx.tables
    const allMessages = await ctx.db
      .select()
      .from(XChainMessage)
      .orderBy(
        desc(XChainMessage.timestamp),
        desc(XChainMessage.txHash),
        desc(XChainMessage.txHash),
      )
    return allMessages
  }),
})

export type AppRouter = typeof appRouter

ponder.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_, c) => c.var,
  }),
)
