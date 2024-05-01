import { DeployedApp } from '@/app/types/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@eth-optimism/ui-components'
import { EditAppDialog } from '@/app/settings/contracts/EditAppDialog'
import { useState } from 'react'

export type AppActionsDropdownProps = {
  app: DeployedApp
  children: React.ReactNode
  onAppNameUpdated: (appName: string) => void
  onStartDeleteApp: (app: DeployedApp) => void
}

export type AppActionsDropdownMenuItemProps = {
  children: React.ReactNode
  onClick?: () => void
}

export const AppActionsDropdownMenuItem = ({
  children,
  onClick,
}: AppActionsDropdownMenuItemProps) => (
  <DropdownMenuItem
    className="min-w-[160px] h-[48px] cursor-pointer"
    onClick={onClick}
  >
    {children}
  </DropdownMenuItem>
)

export const AppActionsDropdown = ({
  app,
  children,
  onAppNameUpdated,
  onStartDeleteApp,
}: AppActionsDropdownProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AppActionsDropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit app name
          </AppActionsDropdownMenuItem>
          <AppActionsDropdownMenuItem onClick={() => onStartDeleteApp(app)}>
            Delete app
          </AppActionsDropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAppDialog
        id={app.id}
        name={app.name}
        open={isEditDialogOpen}
        setOpenChange={setIsEditDialogOpen}
        onNameUpdated={onAppNameUpdated}
      />
    </>
  )
}
