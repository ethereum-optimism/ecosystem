import { createConfig } from '@ponder/core'

import { optimist } from './src/constants/contracts'
import { networks } from './src/constants/networks'

export default createConfig({
  networks,
  contracts: {
    optimist,
  },
})
