import { z } from 'zod'

// v0.7 not supported yet
export const entryPointSchema = z.literal(
  '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // v0.6
  {
    required_error: 'EntryPoint address is required',
    invalid_type_error: 'Unsupported EntryPoint',
  },
)
