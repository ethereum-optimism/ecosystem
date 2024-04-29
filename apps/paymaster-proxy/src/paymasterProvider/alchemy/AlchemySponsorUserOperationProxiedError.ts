import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'

// Directly returns the same message and code as the rpc error from the Alchemy provider
export class AlchemySponsorUserOperationProxiedError extends JsonRpcCastableError {
  constructor(
    code: number,
    message: string,
    readonly alchemyPolicyId: string,
  ) {
    super(code, message)
  }
}
