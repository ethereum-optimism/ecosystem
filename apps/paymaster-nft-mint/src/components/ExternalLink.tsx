export const ExternalLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <a href={href} className="inline-flex items-center gap-1 hover:opacity-70">
    {children}
  </a>
)
