import { Authentications } from '@/app/faucet/types'

export const hasAuthentication = (authentications: Authentications) => {
  return Object.values(authentications).some((auth) => auth)
}
