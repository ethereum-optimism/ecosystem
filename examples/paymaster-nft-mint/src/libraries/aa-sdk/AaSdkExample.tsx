import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components'
import { ExternalLink } from '@/components/ExternalLink'
import {
  RiEthLine,
  RiGithubFill,
  RiToolsLine,
  RiWallet3Line,
} from '@remixicon/react'
import { RecentUserOpTransactions } from '@/components/RecentUserOpTransactions'
import { ModularAccountAaSdkCard } from '@/libraries/aa-sdk/ModularAccountAaSdkCard'

import { useDefaultModularAccountClientWithPaymaster } from '@/libraries/aa-sdk/useModularAccountClientWithPaymaster'
import { LoadingCard } from '@/components/LoadingCard'

export const AaSdkExample = () => {
  const {
    data: modularAccountClient,
    isLoading: isModularAccountClientLoading,
  } = useDefaultModularAccountClientWithPaymaster()

  const isLoading = isModularAccountClientLoading || !modularAccountClient
  return (
    <>
      <ModularAccountAaSdkCard />
      {isLoading ? (
        <LoadingCard />
      ) : (
        <RecentUserOpTransactions
          accountAddress={modularAccountClient.getAddress()}
          chainId={modularAccountClient.chain.id}
        />
      )}

      <Card className="w-[400px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">References</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <RiWallet3Line className="h-[1rem] w-[1rem]" />
            <ExternalLink href="https://github.com/alchemyplatform/modular-account">
              Modular account
            </ExternalLink>
          </div>
          <div className="flex items-center gap-2">
            <RiEthLine className="h-[1rem] w-[1rem]" />

            <ExternalLink href="https://github.com/alchemyplatform/modular-account">
              Superchain paymaster
            </ExternalLink>
          </div>
          <div className="flex items-center gap-2">
            <RiToolsLine className="h-[1rem] w-[1rem]" />
            <ExternalLink href="https://github.com/alchemyplatform/aa-sdk">
              aa-sdk
            </ExternalLink>
          </div>
          <div className="flex items-center gap-2">
            <RiGithubFill className="h-[1rem] w-[1rem]" />
            <ExternalLink href="https://github.com/alchemyplatform/modular-account">
              GitHub repo
            </ExternalLink>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
