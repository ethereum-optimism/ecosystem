import type { z } from 'zod'

import type { zodCursor, zodListRequest } from './zodHelpers'

export type ListRequest = z.infer<ReturnType<typeof zodListRequest>>

export type Cursor = z.infer<typeof zodCursor>

export type ListResponse<T> = {
  nextCursor?: Cursor
  prevCursor?: Cursor
  records: T[]
}
