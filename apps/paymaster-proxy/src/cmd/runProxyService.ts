import { ProxyService } from '@/ProxyService'

const run = async () => {
  const service = await ProxyService.init().catch((e) => {
    console.error('Proxy service failed to initialize', e)
    process.exit(1)
  })
  await service.run().catch((e) => {
    console.error('Proxy service failed to run', e)
    process.exit(1)
  })
}

run()
