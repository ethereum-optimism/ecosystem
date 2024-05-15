import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'

export class InvalidPolicyIdError extends JsonRpcCastableError {
  constructor() {
    super(-32602, 'Invalid policy ID')
  }
}
