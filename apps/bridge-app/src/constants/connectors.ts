import { injected, walletConnect } from 'wagmi/connectors'

export const connectors = [
  injected(),
  walletConnect({ projectId: import.meta.env.VITE_WALLECT_CONNECT_PROJECT_ID }),
]
