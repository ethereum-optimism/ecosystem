import { createInteropSchema } from '@eth-optimism/utils-ponder-interop'

export const { sentMessages, relayedMessages } = createInteropSchema({
  tableName: {
    sentMessages: 'l2_to_l2_cdm_sent_messages',
    relayedMessages: 'l2_to_l2_cdm_relayed_messages',
  },
})
