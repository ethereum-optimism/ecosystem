import { Button } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'hono/cloudflare-workers'

import { app } from '@/app'
import {
  getChainConfigForId,
  supportedL2Chains,
} from '@/constants/supportedChains'
import { registerChainHandler } from '@/registerChainHandler'
import { Intro } from '@/screens/Intro'
import { splitArrayIntoPages } from '@/util/splitArrayIntoPages'

// Chain selection
app.frame('/', (c) => {
  const { buttonValue, deriveState } = c

  const pages = splitArrayIntoPages(supportedL2Chains)

  const state = deriveState((previousState) => {
    const pageCount = pages.length
    if (buttonValue === 'next') {
      previousState.chainSelection.pageIndex = Math.min(
        previousState.chainSelection.pageIndex + 1,
        pageCount - 1,
      )
    } else if (buttonValue === 'prev') {
      previousState.chainSelection.pageIndex = Math.max(
        previousState.chainSelection.pageIndex - 1,
        0,
      )
    }
  })

  const pageIndex = state.chainSelection.pageIndex
  const page = pages[state.chainSelection.pageIndex]
  const isLastPage = pageIndex === pages.length - 1
  const isFirstPage = pageIndex === 0

  return c.res({
    image: <Intro />,
    intents: [
      !isFirstPage && <Button value="prev">⬅️</Button>,
      ...page.map((chain) => {
        const emoji = getChainConfigForId(c.env, chain.id).emoji
        return (
          <Button action={`/${chain.id.toString()}`}>
            {emoji ? `${emoji} ` : ''}
            {chain.name}
          </Button>
        )
      }),
      !isLastPage && <Button value="next">➡️</Button>,
    ].filter(Boolean),
  })
})

// Every chain has a different handler
// ie. /8453/bridge/0.01

// NOTE:  not using app.route is because frog doesn't support being able to use a parent route in action
// The app needs ability to return to initial chain selector screen
supportedL2Chains.forEach((chain) => {
  registerChainHandler(app, chain)
})

const isCloudflareWorker = typeof caches !== 'undefined'
if (isCloudflareWorker) {
  // @ts-expect-error - Static content manifest is injected by the build
  const manifest = await import('__STATIC_CONTENT_MANIFEST')
  const serveStaticOptions = { manifest, root: './' }
  app.use('/*', serveStatic(serveStaticOptions))
  devtools(app, { assetsPath: '/frog', serveStatic, serveStaticOptions })
} else {
  devtools(app, { serveStatic })
}

export { app }

export default app
