import { faucetRoutes } from '@/app/constants'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { RiArrowRightSLine } from '@remixicon/react'
import { Authentications } from '@/app/faucet/types'
import { hasAuthentication } from '@/app/faucet/helpers'
import { LogoChain } from '@/app/faucet/components/LogoChain'
import { AuthenticatedHeader } from '@/app/faucet/components/AuthenticatedHeader'
import { FaucetHeaderInner } from './FaucetHeaderInner'

type FaucetHeaderProps = {
  signedIn: boolean
  wallet: boolean
  authentications: Authentications
}

const seeDetailsLink = (
  <a
    href={faucetRoutes.SEE_DETAILS_URL}
    target="_blank"
    rel="noreferrer"
    className="underline hover:no-underline"
  >
    See details
  </a>
)

const FaucetHeader = ({
  signedIn,
  wallet,
  authentications,
}: FaucetHeaderProps) => {
  return (
    <div>
      {hasAuthentication(authentications) ? (
        <AuthenticatedHeader authentications={authentications} />
      ) : (
        <div className="flex justify-between flex-col-reverse md:flex-row items-start gap-4">
          <FaucetHeaderInner
            signedIn={signedIn}
            wallet={wallet}
            authentications={authentications}
          />
          <LogoChain />
        </div>
      )}
    </div>
  )
}

export { FaucetHeader }
