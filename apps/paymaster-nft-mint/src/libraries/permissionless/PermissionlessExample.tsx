import { RecentUserOpTransactions } from '@/components/RecentUserOpTransactions'

import { LoadingCard } from '@/components/LoadingCard'
import { useDefaultKernelSmartAccountClient } from '@/libraries/permissionless/useKernelSmartAccountClient'
import { KernelPermissionlessCard } from '@/libraries/permissionless/KernelPermissionlessCard'
import { ReferenceItem, ReferencesCard } from '@/components/ReferencesCard'
import {
  RiEthLine,
  RiGithubFill,
  RiToolsLine,
  RiWallet3Line,
} from '@remixicon/react'

export const PermissionlessExample = () => {
  const {
    data: kernelSmartAccountClient,
    isLoading: isKernelSmartAccountClientLoading,
  } = useDefaultKernelSmartAccountClient()

  const isLoading =
    isKernelSmartAccountClientLoading || !kernelSmartAccountClient
  return (
    <>
      <KernelPermissionlessCard />
      {isLoading ? (
        <LoadingCard />
      ) : (
        <RecentUserOpTransactions
          accountAddress={kernelSmartAccountClient.account.address}
          chainId={kernelSmartAccountClient.chain.id}
        />
      )}

      <ReferencesCard>
        <ReferenceItem
          Icon={RiWallet3Line}
          href="https://github.com/zerodevapp/kernel"
        >
          Kernel account
        </ReferenceItem>

        <ReferenceItem
          Icon={RiEthLine}
          href="https://github.com/ethereum-optimism/ecosystem"
        >
          Superchain paymaster
        </ReferenceItem>
        <ReferenceItem
          Icon={RiToolsLine}
          href="https://github.com/pimlicolabs/permissionless.js"
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
