import 'dotenv/config'

import { envVarsSchema } from '@/envVarsSchema'
import { testEnvVars } from '@/testUtils/testEnvVars'

const isTest = process.env.NODE_ENV === 'test'

export const envVars = envVarsSchema.parse(isTest ? testEnvVars : process.env)
