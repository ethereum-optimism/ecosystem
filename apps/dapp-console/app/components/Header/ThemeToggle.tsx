'use client'

import * as React from 'react'
import { RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'

import { Button } from '@eth-optimism/ui-components/src/components/ui/button'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleButtonClicked = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="outline" size="icon" onClick={handleButtonClicked}>
      <RiSunLine className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <RiMoonLine className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export { ThemeToggle }
