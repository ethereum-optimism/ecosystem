import express from 'express'

import { envVars } from '@/envVars'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(envVars.PORT, envVars.HOST, () => {
  console.log(`Server listening at http://${envVars.HOST}:${envVars.PORT}`)
})
