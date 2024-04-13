import type { z } from 'zod'

import type {
  zodCreatedAtCursor,
  zodListRequest,
  zodNameCursor,
} from './zodHelpers'

export type ListRequest = z.infer<ReturnType<typeof zodListRequest>>

export type CreatedAtCursor = z.infer<typeof zodCreatedAtCursor>

export type NameCursor = z.infer<typeof zodNameCursor>

export type Cursor = CreatedAtCursor | NameCursor

export type ListResponse<T> = {
  nextCursor?: Cursor
  prevCursor?: Cursor
  records: T[]
}
