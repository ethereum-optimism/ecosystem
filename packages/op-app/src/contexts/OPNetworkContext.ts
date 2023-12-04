import { createContext } from 'react'

import type { OPNetworkContextValue } from '../types'

export const OPNetworkContext = createContext<
  OPNetworkContextValue | undefined
>(undefined)
