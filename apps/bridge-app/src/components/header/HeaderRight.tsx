import { AccountMenu } from '@/components/AccountMenu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'

export const HeaderRight = () => {
  return (
    <div className="account-menu flex flex-row">
      <div className="space-x-3 hidden md:flex">
        <ThemeToggle />
        <Separator orientation="vertical" />
      </div>
      <div className="flex flex-row align-center pl-6">
        <AccountMenu />
      </div>
    </div>
  )
}
