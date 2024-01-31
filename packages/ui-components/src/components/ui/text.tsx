import React, { ReactNode } from 'react'

type TextProps<T extends React.ElementType> = {
  as?: T
  children: ReactNode
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
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

export { Text }
