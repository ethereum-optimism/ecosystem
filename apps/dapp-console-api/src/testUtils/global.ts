import { startAnvilL2Instance } from './anvil'

async function main() {
  const shutdownL2 = await startAnvilL2Instance()

  return () => {
    shutdownL2()
  }
}

export default main
