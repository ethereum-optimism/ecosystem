export type HeaderLeftProps = {
  logo: string
}

export const HeaderLeft = ({ logo }: HeaderLeftProps) => {
  return (
    <div className="flex logo">
      <img src={logo} />
    </div>
  )
}
