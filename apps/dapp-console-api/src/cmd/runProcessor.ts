import { Processor } from '@/Processor'

const run = async () => {
  const processor = await Processor.init().catch((e) => {
    console.error('Processor failed to initialize', e)
    process.exit(1)
  })
  await processor.run().catch((e) => {
    console.error('Processor failed to run', e)
    process.exit(1)
  })
}

run()
