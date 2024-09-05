import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import { apiClient } from '@/app/helpers/apiClient'
import { toast } from '@eth-optimism/ui-components'
import { LONG_DURATION } from '@/app/constants/toast'
import { captureError } from '@/app/helpers/errorReporting'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

const useAuth = () => {
  const { mutateAsync: loginUser } = apiClient.auth.loginUser.useMutation()
  const { mutateAsync: logoutUser } = apiClient.auth.logoutUser.useMutation()
  const { ready, authenticated, user } = usePrivy()
  const githubAuthRequired = useFeatureFlag('enable_github_auth')

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

  return {
    login: privyLogin,
    logout: privyLogout,
    userNeedsGithubAuth:
      githubAuthRequired && ready && authenticated && !user?.github,
  }
}

export { useAuth }
