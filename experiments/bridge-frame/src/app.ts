import { Frog } from 'frog'

import type { Env } from '@/env'
import type { State } from '@/state'

export const app = new Frog<{ Bindings: Env; State: State }>({
  imageAspectRatio: '1:1',
  imageOptions: {
    width: 600,
    height: 600,
    fonts: [
      {
        name: 'Sora',
        weight: 500,
        source: 'google',
      },
      {
        name: 'Sora',
        weight: 600,
        source: 'google',
      },
      {
        name: 'Sora',
        weight: 700,
        source: 'google',
      },
    ],
  },
  initialState: {
    chainSelection: {
      pageIndex: 0,
    },
  },
})

export type App = typeof app
