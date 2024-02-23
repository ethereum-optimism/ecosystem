import type { CounterConfiguration, LabelValues } from 'prom-client'
import { Counter } from 'prom-client'

import type {
  Curriable,
  LabelValuesExcludingDefault,
  RequiredLabelValues,
} from '@/monitoring/types'

// Inspired by https://pkg.go.dev/github.com/prometheus/client_golang@v1.8.0/prometheus#MetricVec.CurryWith
// Allows creating a counter with default labels
// Doesn't support full API, but we only use the inc method
export class CurriableCounter<T extends string, K extends T>
  implements Curriable<T, K>
{
  counter: Counter<T>
  defaultLabelValues: LabelValues<K>

  constructor(counter: Counter<T>, defaultLabelValues: RequiredLabelValues<K>) {
    this.counter = counter
    this.defaultLabelValues = defaultLabelValues
  }

  static create<U extends string>(config: CounterConfiguration<U>) {
    return new CurriableCounter(new Counter(config), {})
  }

  curryWith<U extends Exclude<T, K>>(
    additionalDefaultLabelValues: RequiredLabelValues<U>,
  ) {
    return new CurriableCounter(this.counter, {
      ...this.defaultLabelValues,
      ...additionalDefaultLabelValues,
    })
  }

  inc = (labels: LabelValuesExcludingDefault<T, K> = {}) => {
    this.counter.inc({
      ...this.defaultLabelValues,
      ...labels,
    } as LabelValues<T>)
  }
}
