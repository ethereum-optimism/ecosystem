import { fetchLogs } from '@viem/anvil'
import { afterAll, afterEach } from 'vitest'

import { createL1AnvilClient, createL2AnvilClient } from './anvil.js'
import { l1ForkURL, l2ForkURL } from './chains.js'
import { L1_PORT, L2_PORT } from './constants.js'

const l1TestClient = createL1AnvilClient()
const l2TestClient = createL2AnvilClient()

afterAll(async () => {
  await l1TestClient.reset({ jsonRpcUrl: l1ForkURL })
  await l2TestClient.reset({ jsonRpcUrl: l2ForkURL })
})

afterEach(async (context) => {
  context.onTestFailed(async () => {
    console.log('##### L1 Logs #####')
    const l1Logs = await fetchLogs(
      `http://localhost:${L1_PORT}`,
      Number(process.env.VITEST_vitestPool_ID),
    )
    console.log(...l1Logs.slice(-20))

    console.log('###################')

    console.log('##### L2 Logs #####')
    const l2Logs = await fetchLogs(
      `http://localhost:${L2_PORT}`,
      Number(process.env.VITEST_vitestPool_ID),
    )
    console.log(...l2Logs.slice(-20))
  })
})
