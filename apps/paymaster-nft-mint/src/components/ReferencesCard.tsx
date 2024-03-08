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

export const ReferencesCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">References</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">{children}</CardContent>
    </Card>
  )
}

export const ReferenceItem = ({
  Icon,
  href,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>
  href: string
  children: React.ReactNode
}) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-[1rem] w-[1rem]" />
      <ExternalLink href={href}>{children}</ExternalLink>
    </div>
  )
}
