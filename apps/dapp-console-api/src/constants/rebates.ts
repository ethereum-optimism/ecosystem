import { parseEther } from 'viem'

import { envVars } from './envVars'

export const MAX_REBATE_AMOUNT = parseEther(envVars.MAX_REBATE_AMOUNT)
