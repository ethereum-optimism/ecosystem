---
'@eth-optimism/viem': minor
---

Support OP Stack Upgrade 22 (Lagoon) and require `viem@^2.58.2`.

- Raise the `viem` peer dependency to `^2.58.2`.
- Generated chain definitions no longer set `contracts.disputeGameFactory`. viem then reads the factory from `OptimismPortal2.disputeGameFactory()`, so withdrawal proving keeps working after OP Mainnet and Unichain move to a shared `DisputeGameFactory`.
- Update the `L2ToL2CrossDomainMessenger`, `SuperchainETHBridge` and `CrossL2Inbox` ABIs to the Lagoon contracts (message expiry, `refundETH`; `resendMessage` is removed), and add `ethLiquidityAbi` and `undeliveredMessageExporterAbi`.
- Add `ethLiquidity` and `undeliveredMessageExporter` to `interopContracts`.
- Add interop actions: `getCrossDomainMessageExpiry`, `exportUndeliveredMessage`, `refundETH` and `getETHLiquidityPaused`, with gas estimation and simulation variants and decorator entries.
- Fill EIP-1559 fees before estimating gas in write actions and in `estimateRelayCrossDomainMessageGas` and `simulateRelayCrossDomainMessage`. `CrossL2Inbox` rejects executing messages with a zero gas price.
- Deprecate `sendSuperchainERC20` and `interopContracts.superchainTokenBridge`: Lagoon does not include the `SuperchainTokenBridge` predeploy.
