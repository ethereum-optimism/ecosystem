import 'dotenv/config'

import { cleanEnv, port, str } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  PRIVY_APP_ID: str(),
  PRIVY_APP_SECRET: str(),
})
