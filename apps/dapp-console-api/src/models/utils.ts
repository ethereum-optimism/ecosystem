import type {
  Column,
  ExtractTablesWithRelations,
  SQLWrapper,
  Table,
  TableRelationalConfig,
} from 'drizzle-orm'
import { and, asc, desc, eq, gte, lte, or } from 'drizzle-orm'
import type { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'

import type * as schema from './schema'

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
  TFields extends TableRelationalConfig,
  TSchema extends ExtractTablesWithRelations<typeof schema>,
  TQueryBuilder extends RelationalQueryBuilder<TSchema, TFields>,
  OrderKey extends keyof TTable['$inferSelect'],
  IdKey extends keyof TTable['$inferSelect'],
  TWithSelector extends NonNullable<
    Parameters<TQueryBuilder['findMany']>[0]
  >['with'],
>(input: {
  queryBuilder: TQueryBuilder
  withSelector: TWithSelector
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
  const {
    queryBuilder,
    table,
    filters,
    limit,
    orderBy,
    idColumnKey,
    cursor,
    withSelector,
  } = input
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

  return queryBuilder.findMany({
    with: withSelector,
    where: and(...filters, cursorFilter),
    limit: limit + 1,
    orderBy: [
      orderBy.direction === 'desc'
        ? desc(tableOrderByColumn)
        : asc(tableOrderByColumn),
      asc(tableIdColumn),
    ],
  })
}
