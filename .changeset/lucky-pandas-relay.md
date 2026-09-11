---
'@eth-optimism/viem': patch
---

forward gas parameters through simulateRelayCrossDomainMessage

It only read account, id, payload and accessList, so callers could not set a gas
price. CrossL2Inbox rejects relayMessage when tx.gasprice is 0 and basefee is
not, which made the action unusable on any chain with a non-zero basefee.
