import { describe, expect, it } from 'vitest'
import { useAccount } from 'wagmi'

import { l1, l2 } from '../test-utils/chains'
import {
  connectToNetwork,
  disconnectFromNetwork,
  renderHook,
  waitFor,
} from '../test-utils/react'
import { useSwitchNetworkDirection } from '.'

const networkPair = { l1, l2 }

describe('useSwitchNetworkPair', () => {
  it('switches from l1 -> l2', async () => {
    await connectToNetwork(l1.id)

    const { result } = renderHook(() => ({
      useAccount: useAccount(),
      useSwitchNetworkDirection: useSwitchNetworkDirection({
        networkPair,
        direction: 'l2',
      }),
    }))

    const chainIdInitial = result.current.useAccount.chainId
    expect(chainIdInitial).toEqual(l1.id)

    result.current.useSwitchNetworkDirection.switchNetworkPair()
    await waitFor(() => {
      expect(result.current.useSwitchNetworkDirection.isLoading).toBeFalsy()
    })

    const chainIdFinal = result.current.useAccount.chainId
    expect(chainIdFinal).toEqual(l2.id)

    await disconnectFromNetwork()
  })

  it('switches from l2 -> l1', async () => {
    await connectToNetwork(l2.id)

    const { result } = renderHook(() => ({
      useAccount: useAccount(),
      useSwitchNetworkDirection: useSwitchNetworkDirection({
        networkPair,
        direction: 'l1',
      }),
    }))

    const chainIdInitial = result.current.useAccount.chainId
    expect(chainIdInitial).toEqual(l2.id)

    result.current.useSwitchNetworkDirection.switchNetworkPair()
    await waitFor(() => {
      expect(result.current.useSwitchNetworkDirection.isLoading).toBeFalsy()
    })

    const chainIdFinal = result.current.useAccount.chainId
    expect(chainIdFinal).toEqual(l1.id)

    await disconnectFromNetwork()
  })
})
