import { screenAddress } from '@eth-optimism/screening'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { envVars } from '@/constants'
import { sanctionEntity } from '@/models'
import { mockDB } from '@/testhelpers'
import { getRandomAddress } from '@/testUtils/getRandomAddress'

import { checkIfSanctionedAddress } from './screening'

vi.mock('@/models', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@/models')),
  sanctionEntity: vi.fn().mockImplementation(async () => {}),
}))

vi.mock('@eth-optimism/screening', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@eth-optimism/screening')),
  screenAddress: vi.fn(),
}))

vi.mock('@/constants', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@/constants')),
  envVars: {
    PERFORM_ADDRESS_SCREENING: true,
  },
}))

describe('checkIfSanctionedAddress', () => {
  beforeEach(() => {
    envVars.PERFORM_ADDRESS_SCREENING = true
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('does not screen address if PERFORM_ADDRESS_SCREENING env var set to false', async () => {
    envVars.PERFORM_ADDRESS_SCREENING = false

    const result = await checkIfSanctionedAddress({
      db: mockDB,
      address: getRandomAddress(),
      entityId: 'id1',
    })

    expect(screenAddress).not.toBeCalled()
    expect(result).toBe(false)
  })

  it('does not sanction entity if screening service returns false', async () => {
    ;(screenAddress as Mock).mockImplementation(async () => false)

    const result = await checkIfSanctionedAddress({
      db: mockDB,
      address: getRandomAddress(),
      entityId: 'id1',
    })

    expect(sanctionEntity).not.toBeCalled()
    expect(result).toBe(false)
  })

  it('sanctions entity if screening service returns false', async () => {
    ;(screenAddress as Mock).mockImplementation(async () => true)

    const address = getRandomAddress()
    const result = await checkIfSanctionedAddress({
      db: mockDB,
      address,
      entityId: 'id1',
    })

    expect(sanctionEntity).toBeCalledWith({
      db: mockDB,
      entityId: 'id1',
      sanctionedAddress: address,
    })
    expect(result).toBe(true)
  })
})
