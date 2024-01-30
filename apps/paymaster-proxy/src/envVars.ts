import 'dotenv/config'

import { envVarsSchema } from '@/envVarsSchema'

export const envVars = envVarsSchema.parse(process.env)
