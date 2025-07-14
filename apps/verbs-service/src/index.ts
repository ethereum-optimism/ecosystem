import { VerbsApp } from '@/app.js'

const app = new VerbsApp()
app.run().catch((error) => {
  console.error('Failed to start verbs service:', error)
  process.exit(1)
})
