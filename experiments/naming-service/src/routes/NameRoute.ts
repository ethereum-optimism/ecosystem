import { verifyMessage } from 'ethers/lib/utils'

import type { Database } from '@/db'
import { getName, setName, ZodNameWithSignature } from '@/models'

import { Trpc } from '..'
import { Route } from './Route'

export class NameRoute extends Route {
  public readonly name = 'name' as const

  public readonly setNameRoute = 'setName' as const
  public readonly setNameController = this.trpc.procedure
    .input(ZodNameWithSignature)
    .mutation(async ({ input }) => {
      const { name, owner, signature } = input
      // Only allow 3LDs, no nested subdomains
      if (name.split('.').length !== 3) {
        console.error('invalid name')
        throw Trpc.handleStatus(400, 'Invalid name')
      }

      try {
        const signer = verifyMessage(signature.message, signature.hash)
        if (signer.toLowerCase() !== owner.toLowerCase()) {
          throw new Error('Invalid signer')
        }
      } catch (err) {
        console.error(err)
        throw Trpc.handleStatus(401, 'Invalid signature')
      }

      // Check if the name is already taken
      const existingName = await getName(this.db, name)

      // If the name is owned by someone else, return an error
      if (existingName && existingName.owner !== owner) {
        throw Trpc.handleStatus(409, 'Name already takene')
      }

      // Save the name
      try {
        await setName(this.db, input)
        return { success: true }
      } catch (err) {
        console.error(err)
        throw Trpc.handleStatus(500, 'Error setting name')
      }
    })

  public readonly handler = this.trpc.router({
    [this.setNameRoute]: this.setNameController,
  })

  constructor(
    trpc: Trpc,
    private readonly db: Database,
  ) {
    super(trpc)
  }
}
