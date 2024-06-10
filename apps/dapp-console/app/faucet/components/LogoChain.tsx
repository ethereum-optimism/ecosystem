import Image from 'next/image'

const LogoChain = () => {
  const images = [
    '/logos/gitcoin-logo.png',
    '/logos/worldid-logo.png',
    '/logos/eas-logo.png',
    '/logos/coinbase-logo.png',
  ]
  return (
    <div className="flex flex-row-reverse md:w-36">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt="Logo"
          height={36}
          width={36}
          style={{
            zIndex: index,
            marginLeft: index === images.length - 1 ? 0 : '-12px',
          }}
        />
      ))}
    </div>
  )
}

export { LogoChain }
