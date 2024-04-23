import supertest from 'supertest'
import { describe, expect, it } from 'vitest'

import { E2E_TEST_BASE_URL } from '@/e2eTests/e2eTestBaseUrl'

const app = supertest(E2E_TEST_BASE_URL)

describe.skip('JSON RPC handlers', async () => {
  it('should 404 on GET requests', async () => {
    await app.get('/v1/11155420/rpc').expect(404)
  })

  it('should still return 200 on invalid POST requests', async () => {
    const result = await app.post('/v1/11155420/rpc').expect(200)
    expect(result.body).toMatchObject({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32600,
      },
    })
  })

  it('should return error array on invalid array input', async () => {
    const result = await app
      .post('/v1/11155420/rpc')
      .send([
        { jsonrpc: '2.0', method: 'sum', params: [1, 2, 4], id: '1' },
        { jsonrpc: '2.0', method: 'test' },
      ])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
    expect(result.body).toMatchObject([
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
        },
      },
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
        },
      },
    ])
  })
})
