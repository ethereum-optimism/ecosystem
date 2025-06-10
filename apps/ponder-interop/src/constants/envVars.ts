import 'dotenv/config'

import { getAddress, isAddress } from 'viem'
import { inferSchemas, parseEnv } from 'znv'
import { z } from 'zod'

export const envVarsSchema = inferSchemas({
  GAS_TANK_CONTRACT_ADDRESS: {
    schema: z
      .string()
      .optional()
      .refine(
        (address) => address === undefined || isAddress(address),
        'must be a valid address',
      )
      .transform((address) =>
        address === undefined ? address : getAddress(address),
      ),
  },
})

export const envVars = parseEnv(process.env, envVarsSchema)
