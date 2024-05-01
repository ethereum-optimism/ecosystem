import Image from 'next/image'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { Badge } from '@eth-optimism/ui-components/src/components/ui/badge/badge'

export type DialogMetadata = {
  label: string
  title: string
  description: React.ReactNode
  primaryButton?: React.ReactNode
  secondaryButton?: React.ReactNode
  image?: string
  bannerImage?: string
}

export type StandardDialogContentProps = {
  dialogMetadata: DialogMetadata
}

export const StandardDialogContent = ({
  dialogMetadata,
}: StandardDialogContentProps) => (
  <div>
    <Badge variant="secondary">
      <Text as="p">{dialogMetadata.label}</Text>
    </Badge>
    {dialogMetadata.bannerImage && (
      <Image
        src={dialogMetadata.bannerImage}
        alt={`${dialogMetadata.label} banner`}
        className="w-full rounded-xs mt-6 object-cover"
        width={450}
        height={140}
      />
    )}
    <div className="py-6">
      <Text as="h3" className="text-lg font-semibold mb-2">
        {dialogMetadata.title}
      </Text>
      <div className="text-md text-muted-foreground">
        {dialogMetadata.description}
      </div>
    </div>
    <div className="flex flex-col gap-2.5 w-full">
      {dialogMetadata.primaryButton}
      {dialogMetadata.secondaryButton}
    </div>
  </div>
)
