import { PonderInterop } from '@eth-optimism/utils-ponder-interop'
import { ponder } from 'ponder:registry'
import { relayedMessages, sentMessages } from 'ponder:schema'

new PonderInterop(ponder, {
  sentMessages: sentMessages,
  relayedMessages: relayedMessages,
})
