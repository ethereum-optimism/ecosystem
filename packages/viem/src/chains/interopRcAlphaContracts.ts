import type { Chain } from 'viem'
import { sepolia } from 'viem/chains'

const sourceId = sepolia.id

export const interopRcAlpha0Contracts = {
  opChainProxyAdmin: {
    [sourceId]: { address: '0x8a2df05608b2ae0eb75809b210527dd1d2705e31' },
  },
  addressManager: {
    [sourceId]: { address: '0x436adaadea096e6c8f61ef3dcf76f83604a4495d' },
  },
  l1ERC721BridgeProxy: {
    [sourceId]: { address: '0xb1eb4f07d7ef21952eb7736ab0f048d3dff34011' },
  },
  systemConfigProxy: {
    [sourceId]: { address: '0x38cfb302cda19fd376be2237d220d35c404a36ba' },
  },
  optimismMintableERC20FactoryProxy: {
    [sourceId]: { address: '0x35d43f9e909105168917b004726edb7dcbd6f275' },
  },
  l1StandardBridgeProxy: {
    [sourceId]: { address: '0x6be35d2af0ad0e6955145da1214e16bbffca74d4' },
  },
  l1CrossDomainMessengerProxy: {
    [sourceId]: { address: '0x3393ffdc32d1b4eb4eed15ea076af4941ca20870' },
  },
  optimismPortalProxy: {
    [sourceId]: { address: '0xbd80b66b60a6c6580aa0a92783bdb4c42b1405c4' },
  },
  disputeGameFactoryProxy: {
    [sourceId]: { address: '0x64b013223986389e1594369e01c9cd01667c4aac' },
  },
  anchorStateRegistryProxy: {
    [sourceId]: { address: '0x04b4318d950d669669520609be753d31bd4de88d' },
  },
  permissionedDisputeGame: {
    [sourceId]: { address: '0xf5dbdcbfea04961249425c7127fb9779e930daee' },
  },
  delayedWETHPermissionedGameProxy: {
    [sourceId]: { address: '0x652c61e8a59c218f8facfdf23379b0e851aacc56' },
  },
} as const satisfies Chain['contracts']

export const interopRcAlpha1Contracts = {
  opChainProxyAdmin: {
    [sourceId]: { address: '0x6220fd818ea70803b65dfaba7deb8e72c8fb396e' },
  },
  addressManager: {
    [sourceId]: { address: '0xed401f324b7b8d1bbbf453402969de37c2d20f6a' },
  },
  l1ERC721BridgeProxy: {
    [sourceId]: { address: '0x879c7072c856a0f0efb71a6b8222da5edf993061' },
  },
  systemConfigProxy: {
    [sourceId]: { address: '0xce1da8571d67d139a8040eba35bef8cfd34a0f2f' },
  },
  optimismMintableERC20FactoryProxy: {
    [sourceId]: { address: '0xe7e22560b1945120705c50b573960ecb427ff2ee' },
  },
  l1StandardBridgeProxy: {
    [sourceId]: { address: '0x690194141578fffc38598d60ddbeb24716c5a049' },
  },
  l1CrossDomainMessengerProxy: {
    [sourceId]: { address: '0xd40ea45998b8abae23541249d2522ef97bbb604e' },
  },
  optimismPortalProxy: {
    [sourceId]: { address: '0x92b3b2d4032492cd177fefa20e67c64826ccbc70' },
  },
  disputeGameFactoryProxy: {
    [sourceId]: { address: '0xe0ff87008d8b6e77de390092f523b8fa412828bd' },
  },
  anchorStateRegistryProxy: {
    [sourceId]: { address: '0x352264750cad1dee3b91045150d4efecd2f36ede' },
  },
  permissionedDisputeGame: {
    [sourceId]: { address: '0x9a77e6f08585e5aec9fc64f1aae2469eea7ff420' },
  },
  delayedWETHPermissionedGameProxy: {
    [sourceId]: { address: '0x908f99cd4c0383db228033be08bac37a2c2c1953' },
  },
} as const satisfies Chain['contracts']
