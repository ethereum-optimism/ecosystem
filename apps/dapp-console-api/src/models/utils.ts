import type { Column, SQLWrapper, Table } from 'drizzle-orm'
import { and, asc, desc, eq, gte, lte, or } from 'drizzle-orm'

import type { Database } from '@/db'

export const UINT256_PRECISION = 78

/**
 * Queries the next set of results using @param cursor.
 * @param db database to query
 * @param table table to query
 * @param filters filters to apply to query
 * @param limit number of results for query
 * @param orderBy sorting order for results
 * @param idColumnKey key of the id column on the table
 * @param cursor the cursor to start the query from
 * @returns the next set of results from the @param cursor.
 */
export const generateCursorSelect = async <
  TTable extends Table,
  OrderKey extends keyof TTable['$inferSelect'],
  IdKey extends keyof TTable['$inferSelect'],
>(input: {
  db: Database
  table: TTable
  filters: Array<SQLWrapper | undefined>
  limit: number
  orderBy: {
    direction: 'desc' | 'asc'
    column: OrderKey
  }
  idColumnKey: IdKey
  cursor?: {
    [key in OrderKey | IdKey]: key extends OrderKey
      ? TTable['$inferSelect'][OrderKey]
      : TTable['$inferSelect'][IdKey]
  }
}) => {
  const { db, table, filters, limit, orderBy, idColumnKey, cursor } = input
  const tableOrderByColumn = table[orderBy.column] as Column
  const tableIdColumn = table[idColumnKey] as Column

  const cursorFilter = cursor
    ? or(
        orderBy.direction === 'desc'
          ? lte(tableOrderByColumn, cursor[orderBy.column])
          : gte(tableOrderByColumn, cursor[orderBy.column]),
        and(
          eq(tableOrderByColumn, cursor[orderBy.column]),
          gte(tableIdColumn, cursor[idColumnKey]),
        ),
      )
    : undefined

  return (
    db
      .select()
      .from(table)
      .where(and(...filters, cursorFilter))
      // Get one above the page size in order to retrieve the next cursor.
      .limit(limit + 1)
      .orderBy(
        ...[
          orderBy.direction === 'desc'
            ? desc(tableOrderByColumn)
            : asc(tableOrderByColumn),
          asc(tableIdColumn),
        ],
      )
  )
}
