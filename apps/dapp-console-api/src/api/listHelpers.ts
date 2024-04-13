import type { Cursor, ListResponse } from './types'

export const generateListResponse = <
  TCursor extends Cursor,
  TRecord extends { [key in keyof TCursor]: TCursor[key] },
>(
  records: TRecord[],
  limit: number,
  prevCursor?: TCursor,
): ListResponse<TRecord> => {
  let nextCursor: TCursor | undefined
  if (records.length > limit) {
    nextCursor = records.pop()!
  }
  return {
    nextCursor,
    prevCursor,
    records,
  }
}
