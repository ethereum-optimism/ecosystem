import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  renderHook as rtl_renderHook,
  type RenderHookOptions,
  type RenderHookResult,
  waitFor as rtl_waitFor,
  type waitForOptions,
} from '@testing-library/react'
import { createElement } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { connect, disconnect } from 'wagmi/actions'
import { mock } from 'wagmi/connectors'

import { anvilAccounts } from './anvil'
import { l1, l2 } from './chains'

export { act, cleanup } from '@testing-library/react'

export const opConfig = createConfig({
  chains: [l1, l2],
  connectors: [mock({ accounts: [anvilAccounts[0]] })],
  pollingInterval: 100,
  storage: null,
  transports: {
    [l1.id]: http(),
    [l2.id]: http(),
  },
})

// needed to preserve WagmiConfig prototype
Object.defineProperty(opConfig, 'l2chains', {
  value: {
    [l2.id]: l2,
  },
  writable: true,
  enumerable: true,
  configurable: true,
})

export async function connectToNetwork(chainId?: number) {
  await connect(opConfig, { connector: opConfig.connectors[0]!, chainId })
}

export async function disconnectFromNetwork() {
  await disconnect(opConfig, { connector: opConfig.connectors[0]! })
}

// below is taken from wagmi https://github.com/wevm/wagmi/blob/main/packages/test/src/exports/react.ts

export const queryClient = new QueryClient()

export function createWrapper<TComponent extends React.FunctionComponent<any>>(
  Wrapper: TComponent,
  props: Parameters<TComponent>[0],
) {
  type Props = { children?: React.ReactNode | undefined }
  return function CreatedWrapper({ children }: Props) {
    return createElement(
      Wrapper,
      props,
      createElement(QueryClientProvider, { client: queryClient }, children),
    )
  }
}

export function renderHook<Result, Props>(
  render: (props: Props) => Result,
  options?: RenderHookOptions<Props> | undefined,
): RenderHookResult<Result, Props> {
  queryClient.clear()
  return rtl_renderHook(render, {
    wrapper: createWrapper(WagmiProvider, {
      config: opConfig,
      reconnectOnMount: false,
    }),
    ...options,
  })
}

export function waitFor<T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions | undefined,
): Promise<T> {
  return rtl_waitFor(callback, { timeout: 10_000, ...options })
}
