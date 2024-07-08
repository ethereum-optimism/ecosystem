'use client'
import { hasAuthentication } from '@/app/faucet/helpers'
import { LogoChain } from '@/app/faucet/components/LogoChain'
import { AuthenticatedHeader } from '@/app/faucet/components/AuthenticatedHeader'
import { FaucetHeaderInner } from '@/app/faucet/components/FaucetHeaderInner'
import { useFaucetVerifications } from '@/app/hooks/useFaucetVerifications'

const FaucetHeader = () => {
  const { faucetAuthentications } = useFaucetVerifications()

  return (
    <div>
      {hasAuthentication(faucetAuthentications) ? (
        <AuthenticatedHeader authentications={faucetAuthentications} />
      ) : (
        <div className="flex justify-between flex-col-reverse md:flex-row items-start gap-4">
          <FaucetHeaderInner />
          <LogoChain />
        </div>
      )}
    </div>
  )
}

export { FaucetHeader }
