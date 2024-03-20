import { ChainSwitcher } from '@/components/ChainSwitcher'
import { AaSdkExample } from '@/libraries/aa-sdk/AaSdkExample'
import { PermissionlessExample } from '@/libraries/permissionless/PermissionlessExample'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@eth-optimism/ui-components'
import { baseSepolia, optimismSepolia, sepolia } from 'viem/chains'
import { useChainId } from 'wagmi'

const chainsSupportingKernel = [sepolia, optimismSepolia, baseSepolia]

export const MainPage = () => {
  const chainId = useChainId()
  const isKernelSupportedByChain = chainsSupportingKernel.some(
    ({ id }) => id === chainId,
  )
  return (
    <div className="flex flex-col gap-4 p-8 items-center">
      <div className="text-3xl font-bold">
        Superchain Paymaster Example Dapp
      </div>
      <div className="flex justify-end">
        <ChainSwitcher />
      </div>
      <Tabs defaultValue="aa-sdk" className="w-[400px]">
        <TabsList className="w-full flex">
          <TabsTrigger className="flex-1" value="aa-sdk">
            Modular account
          </TabsTrigger>
          {isKernelSupportedByChain && (
            <TabsTrigger className="flex-1" value="permissionless">
              Kernel
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="aa-sdk" className="flex flex-col gap-4">
          <AaSdkExample />
        </TabsContent>
        {isKernelSupportedByChain && (
          <TabsContent value="permissionless" className="flex flex-col gap-4">
            <PermissionlessExample />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
