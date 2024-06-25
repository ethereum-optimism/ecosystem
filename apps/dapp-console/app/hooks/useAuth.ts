import { useLogin, useLogout } from '@privy-io/react-auth'
import { apiClient } from '@/app/helpers/apiClient'
import { toast } from '@eth-optimism/ui-components'
import { LONG_DURATION } from '@/app/constants/toast'
import { captureError } from '@/app/helpers/errorReporting'

const useAuth = () => {
  const { mutateAsync: loginUser } = apiClient.auth.loginUser.useMutation()
  const { mutateAsync: logoutUser } = apiClient.auth.logoutUser.useMutation()

  const { login: privyLogin } = useLogin({
    onComplete: async () => {
      try {
        await loginUser()
      } catch (e) {
        toast({
          description: 'Sign in failed.',
          duration: LONG_DURATION,
        })
        captureError(e, 'loginUser')
        privyLogout()
      }
    },
    onError: (privyError) => {
      if (privyError !== 'exited_auth_flow') {
        captureError(privyError, 'privyLogin')
      }
    },
  })

  const { logout: privyLogout } = useLogout({
    onSuccess: async () => {
      try {
        await logoutUser()
      } catch (e) {
        captureError(e, 'logoutUser')
      }
    },
  })

  return { login: privyLogin, logout: privyLogout }
}

export { useAuth }
