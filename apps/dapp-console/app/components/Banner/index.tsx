'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export const Banner = () => {
  const { resolvedTheme } = useTheme()
  const [bannerSrc, setBannerSrc] = useState('')

  useEffect(() => {
    setBannerSrc(
      resolvedTheme === 'dark'
        ? '/banners/background-dark.svg'
        : '/banners/background-light.svg',
    )
  }, [resolvedTheme])

  // Ensure bannerSrc has a value before rendering the Image
  if (!bannerSrc) return null

  return (
    <div className="absolute w-full h-100">
      <Image
        className="-inset-x-0 object-cover object-top w-full"
        src={bannerSrc}
        alt="Superchain Developer Console banner"
        width={1920}
        height={400}
      />
      <div className="absolute bottom-0 h-64 w-full bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
