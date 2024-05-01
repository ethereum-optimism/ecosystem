import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'

export class SanctionedAddressError extends JsonRpcCastableError {
  constructor() {
    super(-32603, 'Ineligible address: sanctioned address')
  }
}
