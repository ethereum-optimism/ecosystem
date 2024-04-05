import { Avatar, AvatarImage } from '@eth-optimism/ui-components'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'

const defaultAvatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAKxJREFUWEdjtFmr/Z8BCQSrsiFzqc5ee/sXipmMow4Y8BDov2SIkgbQIx09zkhNFITSFOOoAwY8BAY8EY46YNCFAHo+R8/HhMoFUtVj1AWjDhh0IUDIQZTWHQTTwKgDaB4C/v9WorQHHK50kFrlk6T+gE4Faptw1AEDHgLolRGpiY5QAiBUdxAsBwg1KkcdQPUQQA9y9HxLqJwgpJ7kviEhA9FDgJD6UQeghwAAT47MAS+0U/oAAAAASUVORK5CYII='

export type AccountAvatarProps = {
  className?: string
}

export const AccountAvatar = ({ className }: AccountAvatarProps) => (
  <Avatar className={cn(['h-8 w-8', className])}>
    <AvatarImage src={defaultAvatar} />
  </Avatar>
)
