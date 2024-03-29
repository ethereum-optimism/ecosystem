import { cn } from '../../../lib/utils'

type TextProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
  className?: string
}

function Text<T extends React.ElementType = 'p'>({
  as,
  children,
  className = '',
  ...props
}: TextProps<T> & { as?: T }) {
  const Component = as || 'p'

  return (
    <Component className={cn('cursor-default', className)} {...props}>
      {children}
    </Component>
  )
}

export { Text }
