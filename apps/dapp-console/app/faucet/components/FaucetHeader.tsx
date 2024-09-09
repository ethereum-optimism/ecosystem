'use client'

import { LogoChain } from '@/app/faucet/components/LogoChain'
import { AuthenticatedHeader } from '@/app/faucet/components/AuthenticatedHeader'
import { FaucetHeaderInner } from '@/app/faucet/components/FaucetHeaderInner'
import { useFaucetVerifications } from '@/app/hooks/useFaucetVerifications'

const FaucetHeader = () => {
  const { hasOnChainAuthentication, faucetAuthentications } =
    useFaucetVerifications()

  return (
    <div>
      {hasOnChainAuthentication ? (
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
