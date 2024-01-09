import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { RenderHookResult } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { createElement } from 'react'
import type { Config, WagmiProviderProps } from 'wagmi'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mock } from 'wagmi/connectors'

import { l1, l2 } from './chains'
import { TEST_ACCOUNT } from './constants'

export type RenderConnectedHooksArgs = {
  type: 'l1' | 'l2' | 'unsupported'
}

export const queryClient = new QueryClient()

const opConfig = {
  ...createConfig({
    chains: [l1, l2],
    connectors: [mock({ accounts: [TEST_ACCOUNT] })],
    pollingInterval: 100,
    storage: null,
    transports: {
      [l1.id]: http(),
      [l2.id]: http(),
    },
  }),
  l2chains: {
    [l2.id]: l2,
  },
} as Config

function mockConnectedWallet(chainId: number): Config {
  return {
    ...opConfig,
    state: {
      chainId: chainId,
      connections: new Map().set(opConfig.connectors[0].uid, {
        accounts: [TEST_ACCOUNT],
        chainId: chainId,
        connector: opConfig.connectors[0],
      }),
      current: opConfig.connectors[0].uid,
      status: 'connected',
    },
  } as Config
}

type WrapperProps = { children?: React.ReactNode | undefined }

export function createWrapper<
  TComponent extends React.FunctionComponent<WagmiProviderProps>,
>(Wrapper: TComponent, props: WagmiProviderProps) {
  return function CreatedWrapper({ children }: WrapperProps) {
    return createElement(
      Wrapper,
      props,
      createElement(QueryClientProvider, { client: queryClient }, children),
    )
  }
}

export type RenderConnectedHooksOptions =
  | {
      network: 'l1' | 'l2' | 'unsupported'
    }
  | undefined

export function renderConnectedHook<Result, Props>(
  render: (props: Props) => Result,
  connection: RenderConnectedHooksOptions,
  options?: RenderConnectedHooksOptions,
): RenderHookResult<Result, Props> {
  queryClient.clear()

  let chainId = 100
  if (!connection || connection.network === 'l1') {
    chainId = l1.id
  } else if (connection.network === 'l2') {
    chainId = l2.id
  }

  return renderHook(render, {
    wrapper: createWrapper(WagmiProvider, {
      config: mockConnectedWallet(chainId),
      reconnectOnMount: false,
    }),
    ...options,
  })
}
