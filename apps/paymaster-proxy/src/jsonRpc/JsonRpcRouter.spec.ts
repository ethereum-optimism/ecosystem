import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'
import { JsonRpcRouter } from '@/jsonRpc/JsonRpcRouter'

describe(JsonRpcRouter.name, () => {
  describe('basic functionality', () => {
    it('replaces method if a new one is registered with the same name', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => a - b,
      )
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => a + b,
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: [42, 23],
          id: 1,
        }),
      ).toEqual({ jsonrpc: '2.0', result: 65, id: 1 })
    })

    it('returns correct code and message if handler throws a JsonRpcCastable error', async (async) => {
      class TestJsonRpcCastableError extends JsonRpcCastableError {
        constructor() {
          super(-32033, 'TestJsonRpcCastableError message')
        }
      }

      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => {
          throw new TestJsonRpcCastableError()
        },
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: [42, 23],
          id: 1,
        }),
      ).toEqual({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32033, message: 'TestJsonRpcCastableError message' },
      })
    })

    it('returns correct code and message if handler throws a non-JsonRpcCastable error', async (async) => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => {
          throw new Error()
        },
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: [42, 23],
          id: 1,
        }),
      ).toEqual({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32603, message: 'Internal error' },
      })
    })
  })

  describe('example cases from https://www.jsonrpc.org/specification', () => {
    it('handles rpc call with positional parameters', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => a - b,
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: [42, 23],
          id: 1,
        }),
      ).toEqual({
        jsonrpc: '2.0',
        id: 1,
        result: 19,
      })

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: [23, 42],
          id: 2,
        }),
      ).toEqual({ jsonrpc: '2.0', result: -19, id: 2 })
    })

    it('handles rpc call with named parameters', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: { subtrahend: 23, minuend: 42 },
          id: 3,
        }),
      ).toEqual({ jsonrpc: '2.0', result: 19, id: 3 })

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 'subtract',
          params: { minuend: 42, subtrahend: 23 },
          id: 4,
        }),
      ).toEqual({ jsonrpc: '2.0', result: 19, id: 4 })
    })

    it('handles rpc call of non-existent method', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(
        await jsonRpcRouter.handle({ jsonrpc: '2.0', method: 'foobar', id: 1 }),
      ).toEqual({
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found' },
        id: 1,
      })
    })

    it('handles rpc call with invalid request object', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(
        await jsonRpcRouter.handle({
          jsonrpc: '2.0',
          method: 1,
          params: 'bar',
        }),
      ).toEqual({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: expect.stringContaining('Invalid request'),
        },
        id: null,
      })
    })

    it('handles rpc call with an empty array', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(await jsonRpcRouter.handle([])).toEqual({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: expect.stringContaining('Invalid request'),
        },
        id: null,
      })
    })

    it('handles rpc call with an invalid batch (but not empty)', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(await jsonRpcRouter.handle([1])).toEqual([
        {
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: expect.stringContaining('Invalid request'),
          },
          id: null,
        },
      ])
    })

    it('handles rpc call with invalid Batch', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.object({
          subtrahend: z.number(),
          minuend: z.number(),
        }),
        async ({ subtrahend, minuend }) => minuend - subtrahend,
      )

      expect(await jsonRpcRouter.handle([1, 2, 3])).toEqual([
        {
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: expect.stringContaining('Invalid request'),
          },
          id: null,
        },
        {
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: expect.stringContaining('Invalid request'),
          },
          id: null,
        },
        {
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: expect.stringContaining('Invalid request'),
          },
          id: null,
        },
      ])
    })
    it('handles rpc call batch', async () => {
      const jsonRpcRouter = new JsonRpcRouter()
      jsonRpcRouter.method(
        'subtract',
        z.tuple([z.number(), z.number()]),
        async ([a, b]) => a - b,
      )

      jsonRpcRouter.method('sum', z.array(z.number()), async (numbers) =>
        numbers.reduce((current, a) => current + a, 0),
      )

      expect(
        await jsonRpcRouter.handle([
          { jsonrpc: '2.0', method: 'sum', params: [1, 2, 4], id: '1' },
          { jsonrpc: '2.0', method: 'subtract', params: [42, 23], id: '2' },
          { foo: 'boo' },
          {
            jsonrpc: '2.0',
            method: 'foo.get',
            params: { name: 'myself' },
            id: '5',
          },
        ]),
      ).toEqual([
        { jsonrpc: '2.0', result: 7, id: '1' },
        { jsonrpc: '2.0', result: 19, id: '2' },
        {
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: expect.stringContaining('Invalid request'),
          },
          id: null,
        },
        {
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Method not found' },
          id: '5',
        },
      ])
    })
  })
})
