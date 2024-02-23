import type { GaugeConfiguration, LabelValues } from 'prom-client'
import { Gauge } from 'prom-client'

import type {
  Curriable,
  LabelValuesExcludingDefault,
  RequiredLabelValues,
} from '@/monitoring/types'

export class CurriableGauge<T extends string, K extends T>
  implements Curriable<T, K>
{
  gauge: Gauge<T>
  defaultLabelValues: RequiredLabelValues<K>

  constructor(gauge: Gauge<T>, defaultLabelValues: RequiredLabelValues<K>) {
    this.gauge = gauge
    this.defaultLabelValues = defaultLabelValues
  }

  static create<U extends string>(config: GaugeConfiguration<U>) {
    return new CurriableGauge(new Gauge(config), {})
  }

  curryWith<U extends Exclude<T, K>>(
    additionalDefaultLabelValues: RequiredLabelValues<U>,
  ) {
    return new CurriableGauge(this.gauge, {
      ...this.defaultLabelValues,
      ...additionalDefaultLabelValues,
    })
  }

  setWithLabels = (labels: LabelValuesExcludingDefault<T, K>, value: number) =>
    this.gauge.set(
      { ...this.defaultLabelValues, ...labels } as LabelValues<T>,
      value,
    )

  set(value: number) {
    this.gauge.set(this.defaultLabelValues as LabelValues<T>, value)
  }
}
