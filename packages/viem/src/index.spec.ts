import { describe, expect, it } from 'vitest'

import { helloWorld } from '@/index'

describe('example test', () => {
  it('should return hello world', () => {
    expect(helloWorld()).toEqual('hello world')
  })
})
