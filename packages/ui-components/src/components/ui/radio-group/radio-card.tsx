import * as React from 'react'
import { cn } from '../../../lib/utils'
import { RiCircleFill } from '@remixicon/react'
import { Item, Indicator } from '@radix-ui/react-radio-group'
import { VariantProps, cva } from 'class-variance-authority'

const radioCardVariants = cva(
  'flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-shadow',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-tertiary hover:text-tertiary-foreground transition-colors',
      },
      size: {
        default: 'p-4 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface RadioCardProps
  extends React.ComponentPropsWithoutRef<typeof Item>,
    VariantProps<typeof radioCardVariants> {
  asChild?: boolean
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof Item>,
  RadioCardProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <Item
      ref={ref}
      className={cn(radioCardVariants({ variant, size, className }))}
      {...props}
    >
      <div>{children}</div>
      <div className="h-4 w-4 border-2 border-current rounded-full flex items-center justify-center">
        <Indicator className="flex items-center justify-center">
          <div className="bg-current rounded-full h-4 w-4 flex justify-center items-center">
            <RiCircleFill className=" h-2 w-2 fill-background" />
          </div>
        </Indicator>
      </div>
    </Item>
  )
})
RadioCard.displayName = 'RadioCard'

export { RadioCard }
