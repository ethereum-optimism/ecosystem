import express from 'express'

import { envVars } from '@/envVars'

const app = express()

app.get('/healthz', (req, res) => {
  res.json({ ok: true })
})

app.get('/ready', (req, res) => {
  // TODO: add check for whether underlying services are ready
  res.json({ ok: true })
})

app.listen(envVars.PORT, envVars.HOST, () => {
  console.log(`Server listening at http://${envVars.HOST}:${envVars.PORT}`)
})
