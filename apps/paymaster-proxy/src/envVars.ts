import 'dotenv/config'

import { parseEnv } from 'znv'

import { envVarsSchema } from '@/envVarsSchema'

export const envVars = parseEnv(process.env, envVarsSchema)
