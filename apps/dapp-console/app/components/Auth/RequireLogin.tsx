import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import { apiClient } from '@/app/helpers/apiClient'
import { toast } from '@eth-optimism/ui-components'
import { LONG_DURATION } from '@/app/constants/toast'
import { captureError } from '@/app/helpers/errorReporting'
import { useEffect, useState } from 'react'

export const RequireLogin = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, ready } = usePrivy()
  const { mutateAsync: loginUser } = apiClient.auth.loginUser.useMutation()
  const { mutateAsync: logoutUser } = apiClient.auth.logoutUser.useMutation()
  const [pendingLogin, setPendingLogin] = useState(false)
  const { login } = useLogin({
    onComplete: async () => {
      try {
        setPendingLogin(false)
        await loginUser()
      } catch (e) {
        toast({
          description: 'Sign in failed.',
          duration: LONG_DURATION,
        })
        captureError(e, 'loginUser')
        logout()
      }
    },
    onError: (privyError) => {
      if (privyError !== 'exited_auth_flow') {
        captureError(privyError, 'privyLogin')
      }
      window.location.href = '/'
    },
  })
  const { logout } = useLogout({
    onSuccess: async () => {
      try {
        await logoutUser()
        window.location.href = '/'
      } catch (e) {
        captureError(e, 'logoutUser')
      }
    },
  })
  useEffect(() => {
    if (ready && !authenticated && !pendingLogin) {
      login()
      setPendingLogin(true)
    }
  }, [login, pendingLogin, authenticated, ready])

  return ready && authenticated ? <>{children}</> : null
}
