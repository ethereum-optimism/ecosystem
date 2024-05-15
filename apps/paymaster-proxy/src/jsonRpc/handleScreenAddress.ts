import type { Address } from 'viem'

import { screenAddress } from '@/helpers/screenAddress'
import type { MonitoringCtx } from '@/monitoring/MonitoringCtx'

export const handleScreenAddress = async (
  { logger, metrics, defaultMetricLabels }: MonitoringCtx,
  address: Address,
) => {
  return await screenAddress(address).catch((e) => {
    metrics.screeningServiceCallFailures.inc(defaultMetricLabels)
    logger.error({
      message: 'Error while screening address',
      error: e,
      address: address,
    })

    throw e
  })
}
