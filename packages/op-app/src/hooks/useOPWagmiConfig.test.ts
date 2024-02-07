import { predeploys } from '@eth-optimism/contracts-ts'
import { describe, expect, it } from 'vitest'

import type { NetworkType } from '..'
import { deploymentAddresses, networkPairsByGroup, useOPWagmiConfig } from '..'
import { renderHook } from '../test-utils/react'

describe('useOPWagmiConfig', () => {
  const groups = Object.keys(networkPairsByGroup) as NetworkType[]

  groups.forEach((group) => {
    const networkPairs = networkPairsByGroup[group]

    Object.entries(networkPairs).forEach(([network, [_, l2]]) => {
      it(`should return valid OpConfig with correct protocol contract addresses for ${group} ${network}`, () => {
        const { result } = renderHook(() =>
          useOPWagmiConfig({ type: group, chainId: l2.id }),
        )

        const deploymentAddress = deploymentAddresses[l2.id]
        expect(deploymentAddress).toBeTruthy()

        const addressConfig = result.current.opConfig?.l2chains[l2.id]
        expect(addressConfig).toBeTruthy()

        // l1 addresses
        expect(addressConfig?.l1Addresses.portal.address).toEqual(
          deploymentAddress.OptimismPortalProxy,
        )
        expect(addressConfig?.l1Addresses.l2OutputOracle.address).toEqual(
          deploymentAddress.L2OutputOracleProxy,
        )
        expect(addressConfig?.l1Addresses.l1StandardBridge.address).toEqual(
          deploymentAddress.L1StandardBridgeProxy,
        )
        expect(
          addressConfig?.l1Addresses.l1CrossDomainMessenger.address,
        ).toEqual(deploymentAddress.L1CrossDomainMessengerProxy)
        expect(addressConfig?.l1Addresses.l1Erc721Bridge.address).toEqual(
          deploymentAddress.L1ERC721BridgeProxy,
        )

        // l2 addresses
        expect(
          addressConfig?.l2Addresses.l2L1MessagePasserAddress.address,
        ).toEqual(predeploys.L2ToL1MessagePasser.address)
        expect(addressConfig?.l2Addresses.l2StandardBridge.address).toEqual(
          predeploys.L2StandardBridge.address,
        )
      })
    })
  })
})
