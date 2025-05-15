import { cn } from '@/lib/utils'
import {
  FORMAT_A,
  FORMAT_H1,
  FORMAT_H2,
  FORMAT_H3,
  FORMAT_H4,
  FORMAT_H5,
  FORMAT_H6,
  FORMAT_LI,
  FORMAT_OL,
  FORMAT_P,
  FORMAT_UL,
} from '@/mdx/format'

export const components = {
  h1: ({ className, ...props }: { className: string }) => (
    <h1 className={cn(FORMAT_H1, className)} {...props} />
  ),
  h2: ({ className, ...props }: { className: string }) => (
    <h2 className={cn(FORMAT_H2, className)} {...props} />
  ),
  h3: ({ className, ...props }: { className: string }) => (
    <h3 className={cn(FORMAT_H3, className)} {...props} />
  ),
  h4: ({ className, ...props }: { className: string }) => (
    <h4 className={cn(FORMAT_H4, className)} {...props} />
  ),
  h5: ({ className, ...props }: { className: string }) => (
    <h5 className={cn(FORMAT_H5, className)} {...props} />
  ),
  h6: ({ className, ...props }: { className: string }) => (
    <h6 className={cn(FORMAT_H6, className)} {...props} />
  ),
  a: ({ className, ...props }: { className: string }) => (
    <a className={cn(FORMAT_A, className)} {...props} />
  ),
  p: ({ className, ...props }: { className: string }) => (
    <p className={cn(FORMAT_P, className)} {...props} />
  ),
  ul: ({ className, ...props }: { className: string }) => (
    <ul className={cn(FORMAT_UL, className)} {...props} />
  ),
  ol: ({ className, ...props }: { className: string }) => (
    <ol className={cn(FORMAT_OL, className)} {...props} />
  ),
  li: ({ className, ...props }: { className: string }) => (
    <li className={cn(FORMAT_LI, className)} {...props} />
  ),
}
