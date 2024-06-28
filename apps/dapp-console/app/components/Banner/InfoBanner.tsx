import Link from 'next/link'

interface InfoBannerProps {
  href: string
  icon: React.ReactNode
  text: React.ReactNode
}

export const InfoBanner = ({ href, icon, text }: InfoBannerProps) => (
  <div className="flex flex-row w-full min-h-[60px] items-center bg-blue-500/10 rounded-lg px-4 py-3 text-blue-500 cursor-pointer">
    <Link className="flex flex-row w-full" href={href} target="_blank">
      <div className="mr-3 mt-1">{icon}</div>
      {text}
    </Link>
  </div>
)
