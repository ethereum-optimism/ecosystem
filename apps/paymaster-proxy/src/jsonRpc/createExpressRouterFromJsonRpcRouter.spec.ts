import express from 'express'
import supertest from 'supertest'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createExpressRouterFromJsonRpcRouter } from '@/jsonRpc/createExpressRouterFromJsonRpcRouter'
import { JsonRpcRouter } from '@/jsonRpc/JsonRpcRouter'

describe(createExpressRouterFromJsonRpcRouter.name, () => {
  const jsonRpcRouter = new JsonRpcRouter()
  jsonRpcRouter.method(
    'subtract',
    z.tuple([z.number(), z.number()]),
    async ([a, b]) => {
      return a - b
    },
  )
  const expressRouter = createExpressRouterFromJsonRpcRouter(jsonRpcRouter)
  const app = express()
  app.use('/rpc', expressRouter)

  it('happy path', async () => {
    const result = await supertest(app)
      .post('/rpc')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'subtract',
        params: [5, 3],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)

    expect(result.body).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: 2,
    })
  })

  it('handles unsupported method', async () => {
    const result = await supertest(app)
      .post('/rpc')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'crazy-method',
        params: [5, 3],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)

    expect(result.body).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32601,
        message: 'Method not found',
      },
    })
  })

  it('handles JSON parse error', async () => {
    const result = await supertest(app)
      .post('/rpc')
      .send('{"jsonrpc":"2.0","id":1,"method":"subtract')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)

    expect(result.body).toMatchObject({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error',
      },
    })
  })

  it('rejects non-application/json content type', async () => {
    await supertest(app)
      .post('/rpc')
      .send('{"jsonrpc":"2.0","id":1,"method":"subtract","params":[5,3]}')
      .expect(400)
  })
})
