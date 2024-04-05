import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { jsonb, pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import type { Address, Hash } from 'viem'
import { isAddress, isHex } from 'viem'
import z from 'zod'

import type { Database } from '@/db'

export const ZodName = z.object({
  name: z.string().regex(/^[a-z0-9-.]+$/),
  owner: z.string().refine(isAddress),
  addresses: z.record(z.string(), z.string().refine(isAddress)),
  texts: z.record(z.string()).optional(),
  contenthash: z.string().refine(isHex).optional(),
})

export const ZodNameWithSignature = ZodName.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export type Addresses = { [cointype: string]: Address }

export const names = pgTable(
  'names',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name').notNull(),
    owner: varchar('owner').$type<Address>().notNull(),
    addresses: jsonb('addresses').$type<Addresses>().notNull(),
    contenthash: varchar('contenthash').$type<Hash>(),
    text: jsonb('text'),
  },
  (table) => {
    return {
      nameIdx: uniqueIndex().on(table.name),
    }
  },
)

export type Name = InferSelectModel<typeof names>
export type NameInsert = InferInsertModel<typeof names>

export async function getName(db: Database, name: string) {
  const results = await db.select().from(names).where(eq(names.name, name))
  return results[0] || null
}

export async function setName(db: Database, nameData: NameInsert) {
  await db.insert(names).values(nameData).execute()
}
