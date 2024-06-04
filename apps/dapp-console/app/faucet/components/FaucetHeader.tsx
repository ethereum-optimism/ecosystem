import { Authentications } from '@/app/faucet/types'
import { hasAuthentication } from '@/app/faucet/helpers'
import { LogoChain } from '@/app/faucet/components/LogoChain'
import { AuthenticatedHeader } from '@/app/faucet/components/AuthenticatedHeader'
import { FaucetHeaderInner } from '@/app/faucet/components/FaucetHeaderInner'
import { usePrivy } from '@privy-io/react-auth'

type FaucetHeaderProps = {
  authentications: Authentications
}

const FaucetHeader = ({ authentications }: FaucetHeaderProps) => {
  const { authenticated } = usePrivy()

  return (
    <div>
      {hasAuthentication(authentications) ? (
        <AuthenticatedHeader authentications={authentications} />
      ) : (
        <div className="flex justify-between flex-col-reverse md:flex-row items-start gap-4">
          <FaucetHeaderInner
            signedIn={authenticated}
            authentications={authentications}
          />
          {!authenticated && <LogoChain />}
        </div>
      )}
    </div>
  )
}

export { FaucetHeader }
