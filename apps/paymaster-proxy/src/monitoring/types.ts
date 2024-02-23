import type { LabelValues } from 'prom-client'

export type RequiredLabelValues<T extends string> = Record<T, string | number>

export type LabelValuesExcludingDefault<
  T extends string,
  K extends T,
> = Exclude<T, K> extends never
  ? Record<string, never>
  : LabelValues<Exclude<T, K>>

export interface Curriable<T extends string, K extends T> {
  curryWith: <U extends Exclude<T, K>>(
    additionalDefaultLabelValues: RequiredLabelValues<U>,
  ) => Curriable<T, K | U>
}
