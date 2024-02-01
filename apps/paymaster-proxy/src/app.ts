import express from 'express'

import { envVars } from '@/envVars'
import { rateLimiter } from '@/middlewares/rateLimiter'

const HOST = '0.0.0.0'

const app = express()

app.use(rateLimiter)

app.get('/healthz', (req, res) => {
  res.json({ ok: true })
})

app.get('/ready', (req, res) => {
  // TODO: add check for whether underlying services are ready
  res.json({ ok: true })
})

app.listen(envVars.PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${envVars.PORT}`)
})
