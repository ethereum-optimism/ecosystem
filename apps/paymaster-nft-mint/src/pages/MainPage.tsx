import { ChainSwitcher } from '@/components/ChainSwitcher'
import { AaSdkExample } from '@/libraries/aa-sdk/AaSdkExample'
import { KernelPermissionlessCard } from '@/libraries/permissionless/KernelPermissionlessCard'

export const MainPage = () => {
  return (
    <div className="flex flex-col gap-8 p-8 items-center">
      <div className="text-3xl font-bold">
        Superchain Paymaster Example Dapp
      </div>
      <div className="flex justify-end">
        <ChainSwitcher />
      </div>
      <KernelPermissionlessCard />
      <AaSdkExample />
    </div>
  )
}
