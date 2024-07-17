import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@eth-optimism/ui-components/src/components/ui/accordian/accordion'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import Image from 'next/image'
import { getDocsItems, routes, supportItems } from '@/app/constants'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

interface MobileMenuProps {
  isOpen: boolean
  closeMenu: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, closeMenu }) => {
  const showNewLogo = useFeatureFlag('enable_new_brand')
  const docsItems = getDocsItems(showNewLogo)

  const variants = {
    open: {
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, // Custom easing function
    },
    closed: {
      x: '-100%',
      transition: { duration: 0.2, ease: 'easeInOut' }, // Standard easing
    },
  }

  const backgroundVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, // Custom easing function
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }, // Standard easing
    },
  }

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  return (
    <div
      className="fixed top-18 left-0 w-full h-[calc(100vh-80px)] min-h-[calc(100vh-80px)] z-20"
      style={{ pointerEvents: isOpen ? 'all' : 'none' }}
    >
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        className="w-full h-[calc(100vh-80px)] p-6 sm:max-w-[400px] flex flex-col justify-between z-30 bg-background overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={closeMenu}
          >
            <Link href={routes.CONSOLE.path}>
              <span className="text-lg cursor-pointer">Console</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={closeMenu}
          >
            <Link href={routes.INSIGHTS.path}>
              <span className="text-lg cursor-pointer">Insights</span>
            </Link>
          </Button>
          <Accordion type="single" collapsible>
            <AccordionItem value="support" className="border-none">
              <AccordionTrigger className="h-10 px-4 text-lg hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md">
                Support
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <Text
                  as="p"
                  className="font-semibold uppercase text-muted-foreground text-xs px-4 py-1"
                >
                  Support
                </Text>
                <div className="flex flex-col py-2 gap-1">
                  {supportItems.map((item) => (
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start"
                      key={item.label}
                    >
                      <a href={item.path} target="_blank">
                        <Text as="span">{item.label}</Text>
                      </a>
                    </Button>
                  ))}
                </div>

                <Text
                  as="p"
                  className="font-semibold uppercase text-muted-foreground text-xs px-4 py-1"
                >
                  Docs
                </Text>
                <div className="flex flex-col py-2 gap-1">
                  {docsItems.map((item) => (
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start gap-2"
                      key={item.label}
                    >
                      <a href={item.path} target="_blank">
                        <Image
                          src={item.logo}
                          alt={`${item.label} logo`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <Text as="span">{item.label}</Text>
                      </a>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          className="absolute top-0 left-0 w-full h-[calc(100vh-80px)] bg-black/80 -z-10"
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={backgroundVariants}
          onClick={closeMenu}
        />
      )}
    </div>
  )
}

interface MenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick }) => {
  const lineCommonStyle = {
    width: 24,
    height: 2,
    originX: 0.5,
  }

  const topLineVariants = {
    closed: {
      rotate: 0,
      translateY: -4,
    },
    open: { rotate: 45, translateY: 2 },
  }

  const bottomLineVariants = {
    closed: {
      rotate: 0,
      translateY: 2,
    },
    open: { rotate: -45, translateY: -2 },
  }

  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        borderRadius: 12,
      }}
    >
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={topLineVariants}
        style={{ ...lineCommonStyle }}
        className="bg-foreground mb-0.5"
      />
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={bottomLineVariants}
        style={lineCommonStyle}
        className="bg-foreground"
      />
    </button>
  )
}

export { MobileMenu, MenuButton }
