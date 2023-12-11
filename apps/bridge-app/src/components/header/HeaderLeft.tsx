import { MobileMenu } from '@/components/MobileMenu'

export type HeaderLeftProps = {
  logo: string
}

export const HeaderLeft = ({ logo }: HeaderLeftProps) => {
  return (
    <div className="flex logo">
      <MobileMenu />
      <img src={logo} />
    </div>
  )
}
