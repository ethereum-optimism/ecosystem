import type { Cursor, ListResponse } from './types'

export const generateListResponse = <
  TRecord extends { [key in keyof Cursor]: Cursor[key] },
>(
  records: TRecord[],
  limit: number,
  prevCursor?: Cursor,
): ListResponse<TRecord> => {
  let nextCursor: Cursor | undefined
  if (records.length > limit) {
    const { createdAt, id } = records.pop()!
    nextCursor = { createdAt, id }
  }
  return {
    nextCursor,
    prevCursor,
    records,
  }
}
