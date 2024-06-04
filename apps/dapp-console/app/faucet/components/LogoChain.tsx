import Image from 'next/image'

type Props = {
  images?: string[]
}
const LogoChain = ({ images }: Props) => {
  const displayedImages = images || [
    '/logos/gitcoin-logo.png',
    '/logos/worldid-logo.png',
    '/logos/eas-logo.png',
    '/logos/coinbase-logo.png',
  ]

  return (
    <div className="flex flex-row-reverse">
      {displayedImages.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt="Logo"
          height={36}
          width={36}
          className="max-w-9 max-h-9"
          style={{
            zIndex: index,
            marginLeft: index === displayedImages.length - 1 ? 0 : '-12px',
          }}
        />
      ))}
    </div>
  )
}

export { LogoChain }
