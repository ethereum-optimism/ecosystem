import { useContext } from 'react'

import { OPNetworkContext } from '../contexts/OPNetworkContext'
import type { OPNetworkContextValue } from '../types'

export const useOPNetworkContext = (): OPNetworkContextValue => {
  const ctx = useContext(OPNetworkContext)

  if (!ctx) {
    throw new Error(
      'OPNetworkContext is undefined. Did you initalize OPAppProvider?',
    )
  }

  return ctx
}
