import type { Hex } from 'viem'
import { isHex } from 'viem'
import { z } from 'zod'

export const hexSchema = z.custom<Hex>(
  (val) => typeof val === 'string' && isHex(val),
  'invalid hex string',
)
