import 'dotenv/config'

import { getAddress } from 'viem'
import { inferSchemas, parseEnv } from 'znv'
import { z } from 'zod'

export const envVarsSchema = inferSchemas({
  GAS_TANK_CONTRACT_ADDRESS: {
    schema: z
      .string()
      .optional()
      .transform((address) =>
        address === undefined ? undefined : getAddress(address),
      ),
  },
})

export const envVars = parseEnv(process.env, envVarsSchema)
