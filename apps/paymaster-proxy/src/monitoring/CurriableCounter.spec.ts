import { register } from 'prom-client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CurriableCounter } from '@/monitoring/CurriableCounter'

describe(CurriableCounter.name, () => {
  it('calls inc with correct with empty params', () => {
    const counter = CurriableCounter.create({
      name: 'screeningServiceCallFailures',
      help: 'Number of failures when calling the screening service',
      labelNames: ['namespace', 'subnamespace', 'route'] as const,
    })
    const incSpy = vi.spyOn(counter.counter, 'inc')

    counter.inc()

    expect(incSpy).toHaveBeenCalledWith({})
  })

  it('curriedCounter with default labels calls inc applies default labels', () => {
    const counter = CurriableCounter.create({
      name: 'screeningServiceCallFailures',
      help: 'Number of failures when calling the screening service',
      labelNames: ['namespace', 'subnamespace', 'route'] as const,
    })

    const namespacedCounter = counter.curryWith({ namespace: 'default' })
    const incSpy = vi.spyOn(namespacedCounter.counter, 'inc')

    namespacedCounter.inc()

    expect(incSpy).toHaveBeenCalledWith({
      namespace: 'default',
    })
  })

  it('two level curriedCounter with default labels calls inc applies default labels', () => {
    const counter = CurriableCounter.create({
      name: 'screeningServiceCallFailures',
      help: 'Number of failures when calling the screening service',
      labelNames: ['namespace', 'subnamespace', 'route'] as const,
    })

    const namespacedCounter = counter.curryWith({ namespace: 'default' })

    const subnamespacedCounter = namespacedCounter.curryWith({
      subnamespace: 'defaultSubNamespace',
    })

    const incSpy = vi.spyOn(subnamespacedCounter.counter, 'inc')

    subnamespacedCounter.inc()

    expect(incSpy).toHaveBeenCalledWith({
      namespace: 'default',
      subnamespace: 'defaultSubNamespace',
    })
  })

  afterEach(() => {
    register.clear()
  })
})
