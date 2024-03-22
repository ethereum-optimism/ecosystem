import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@eth-optimism/ui-components/src/components/ui/card/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import { SettingsTab } from '@/app/settings/types'

export type SettingsCardProps = {
  className: string
  children: React.ReactNode
  tab: SettingsTab
}

export const SettingsCardTitle = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <Text as="span" className="text-4xl mb-2">
    {children}
  </Text>
)

export const SettingsCardDescription = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <Text
    as="span"
    className="block text-base text-secondary-foreground mt-6 mb-6"
  >
    {children}
  </Text>
)

export const SettingsCard = ({
  className,
  children,
  tab,
}: SettingsCardProps) => (
  <Card className={className}>
    <CardHeader className="md:px-10 lg:px-16 md:pt-10 lg:pt-16 pb-8">
      <CardTitle>
        <div className="flex">{tab.title}</div>
      </CardTitle>
      {tab.description && (
        <CardDescription>
          <div className="flex">{tab.description}</div>
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="pt-0 md:px-10 md:pb-10 lg:px-16 lg:pb-16">
      <div className="flex flex-col w-full">{children}</div>
    </CardContent>
  </Card>
)
