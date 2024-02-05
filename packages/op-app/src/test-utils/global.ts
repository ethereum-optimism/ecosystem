import { startL1Instance, startL2Instance } from './anvil'

async function main() {
  const shutdownL1 = await startL1Instance()
  const shutdownL2 = await startL2Instance()

  return () => {
    shutdownL1()
    shutdownL2()
  }
}

export default main
