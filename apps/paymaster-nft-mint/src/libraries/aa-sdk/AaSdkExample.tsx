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
import { ReferenceItem, ReferencesCard } from '@/components/ReferencesCard'

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
      <ReferencesCard>
        <ReferenceItem
          Icon={RiWallet3Line}
          href="https://github.com/alchemyplatform/modular-account"
        >
          Modular account
        </ReferenceItem>

        <ReferenceItem
          Icon={RiEthLine}
          href="https://github.com/ethereum-optimism/ecosystem"
        >
          Superchain paymaster
        </ReferenceItem>
        <ReferenceItem
          Icon={RiToolsLine}
          href="https://github.com/alchemyplatform/aa-sdk"
        >
          aa-sdk
        </ReferenceItem>

        <ReferenceItem
          Icon={RiGithubFill}
          href="https://github.com/ethereum-optimism/ecosystem"
        >
          GitHub repo
        </ReferenceItem>
      </ReferencesCard>
    </>
  )
}
