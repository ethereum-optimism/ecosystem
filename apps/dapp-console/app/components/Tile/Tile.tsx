import React, { forwardRef, ComponentPropsWithRef } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@eth-optimism/ui-components/src/components/ui/card/card'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const tileVariants = cva('cursor-pointer flex flex-col', {
  variants: {
    variant: {
      primary: 'shadow-sm hover:shadow-md transition-shadow',
      secondary:
        'bg-secondary border-secondary hover:bg-secondary/80 transition-colors',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type TileProps = {
  title: string
  description?: string
  badge?: React.ReactNode
  icon?: React.ReactNode
  image?: React.ReactNode
  onClick: () => void
  className?: string
} & VariantProps<typeof tileVariants> &
  ComponentPropsWithRef<'div'>

const Tile = forwardRef<HTMLDivElement, TileProps>(
  (
    {
      title,
      description,
      badge,
      icon,
      image,
      onClick,
      variant = 'primary',
      className,
    },
    ref,
  ) => {
    return (
      <Card
        className={cn(tileVariants({ variant }), className)}
        onClick={onClick}
        ref={ref}
      >
        {image && <div className="p-6 pb-4">{image}</div>}
        <div className="flex gap-2">
          <div className="flex-1">
            <CardHeader
              className={cn(
                'pb-1 flex-row items-start',
                Boolean(icon) && 'pr-0',
                Boolean(image) && 'pt-0',
                !description && 'pb-6',
              )}
            >
              <Text as="span" className="text-base font-semibold flex-1">
                {title}
              </Text>
            </CardHeader>
            {description && (
              <CardContent className={cn(Boolean(icon) && 'pr-0')}>
                <Text as="p" className="text-muted-foreground">
                  {description}
                </Text>
              </CardContent>
            )}
          </div>
          {icon && <div className="pr-6 pt-6">{icon}</div>}
        </div>
        {badge && (
          <CardFooter className="mt-auto">
            <span>{badge}</span>
          </CardFooter>
        )}
      </Card>
    )
  },
)

Tile.displayName = 'Tile'

const TileGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-6 auto-rows-[205px] lg:grid-cols-3 md:grid-cols-2">
      {children}
    </div>
  )
}

export { Tile, TileGrid }
