import { ChainSwitcher } from '@/components/ChainSwitcher'
import { AaSdkExample } from '@/libraries/aa-sdk/AaSdkExample'
import { PermissionlessExample } from '@/libraries/permissionless/PermissionlessExample'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@eth-optimism/ui-components'

export const MainPage = () => {
  return (
    <div className="flex flex-col gap-4 p-8 items-center">
      <div className="text-3xl font-bold">
        Superchain Paymaster Example Dapp
      </div>
      <div className="flex justify-end">
        <ChainSwitcher />
      </div>
      <Tabs defaultValue="aa-sdk" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="aa-sdk">Modular account</TabsTrigger>
          <TabsTrigger value="permissionless">Kernel</TabsTrigger>
        </TabsList>
        <TabsContent value="aa-sdk" className="flex flex-col gap-4">
          <AaSdkExample />
        </TabsContent>
        <TabsContent value="permissionless" className="flex flex-col gap-4">
          <PermissionlessExample />
        </TabsContent>
      </Tabs>
    </div>
  )
}
