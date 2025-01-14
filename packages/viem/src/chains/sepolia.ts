// DO NOT MODIFY THIS FILE IS AUTOGENERATED
import type { Chain } from 'viem'
import { defineChain } from 'viem'
import { chainConfig } from 'viem/op-stack'

/**
 * Chain Definition for arena-z-testnet  
 * @type {Chain}
 */
export const arenaZSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'arena-z-testnet',
    id: 9897,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.arena-z.t.raas.gelato.cloud'],
        },
    },
    blockExplorers: {
        default: {
            name: 'arena-z-testnet Explorer',
            url: 'https://arena-z.blockscout.com',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x2188047AD28B78D975cE319dfcDa5D06c2a6a68b',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x76A4B2CC5d210729Fb3DE13CeE250663bdac73A6',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x11d7f6f2E59Fc12E61DbfafE7790e54CAb01b434',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xCC226A3B7b5ec4D4d698418fC2C0492950136Ba7',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xa3c900d30EE6e906FC085633258d2FE619680884',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0xD9E9933Cc6EF672C93d2a42494b0D2BF14C05544',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xf2574585eC7ba515Fd86402B84A60D5eFb51B0Ff',
            }
        },
                
    }
})

/**
 * Chain Definition for Base Sepolia Testnet  
 * @type {Chain}
 */
export const baseSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Base Sepolia Testnet',
    id: 84532,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Base Sepolia Testnet Explorer',
            url: 'https://sepolia-explorer.base.org',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x49f53e41452C74589E85cA1677426Ba426459e85',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x21eFD066e581FA55Ef105170Cc04d74386a09190',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xC34855F4De64F1840e5686e64278da901e261f20',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xf272670eb55e895584501d564AfEB048bEd26194',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1',
            }
        },
                
    }
})

/**
 * Chain Definition for Cyber Testnet  
 * @type {Chain}
 */
export const cyberSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Cyber Testnet',
    id: 111557560,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.testnet.cyber.co'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Cyber Testnet Explorer',
            url: 'https://testnet.cyberscan.co/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x06C9Cadb0346c8E142fb8299cEF3EB5120d4c9b6',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xAA1bD6D4d8cFD37330a917bc678CB38BEFAf44E6',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x524e85D2B49497561c53EFEB4B126Aa63883B480',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xB88ee11d822bEc8055f19711458dE8593E7117A3',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x43b838Aa237B27c4fC953E591594CEBb1CA2817F',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x99f0f9B0E7B16B10042E0935CE34F2fCebBE13C1',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xD94Ce9E4886A6dcEbC7cF993f4b38F5276516643',
            }
        },
                
    }
})

/**
 * Chain Definition for Ethernity Testnet  
 * @type {Chain}
 */
export const ethernitySepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Ethernity Testnet',
    id: 233,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.ethernitychain.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ethernity Testnet Explorer',
            url: 'https://testnet.ernscan.io',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x1F24d471Ef7291c7F97DBD2f76299b30D3e3B6E3',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xFd1a12b7a04B13c031d8b075BA5b9080a2CF246f',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0xBf0D43e12eF74dC21917e1D6175702AD673e1283',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x1c8b6a6F3E3612c79E62460a6e44C24D1EfF2FDa',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x7C957fec1F6B3d1024442E989cB08b8f2285686C',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x64d0Bce6eD7c16CAC7817F3597758E31AFacD01B',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x11118536F94Bc7C98bBaf9194bE13FC1987293cd',
            }
        },
                
    }
})

/**
 * Chain Definition for Funki Sepolia Testnet  
 * @type {Chain}
 */
export const funkiSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Funki Sepolia Testnet',
    id: 3397901,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://funki-testnet.alt.technology'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Funki Sepolia Testnet Explorer',
            url: 'https://sepolia-sandbox.funkichain.com/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xCeE7ef4dDF482447FE14c605Ea94B37cBE87Ca9D',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x1ba82f688eF3C5B4363Ff667254ed4DC59E97477',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x598D245Ea85FBfBceCe6c62232bbCAB688D3F68b',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x6F82D895E223Dde65DA28a8bbD14f3eF79cBF3b8',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xd6A01f1Ef51D65F023433992a8F62fEeAD35b172',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0xEc7C6E35f4e5361D279d5Fe7222F3F45A8A83352',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xB25812386D1Cb976b50de7387F5CBc10Fec3F27c',
            }
        },
                
    }
})

/**
 * Chain Definition for Ink Sepolia  
 * @type {Chain}
 */
export const inkSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Ink Sepolia',
    id: 763373,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc-gel-sepolia.inkonchain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ink Sepolia Explorer',
            url: 'https://explorer-sepolia.inkonchain.com',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x5c1d29C6c9C8b0800692acC95D700bcb4966A1d7',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x33f60714BbD74d62b66D79213C348614DE51901C',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0xd1C901BBD7796546A7bA2492e0E199911fAE68c7',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x9fE1d3523F5342535E6E7770ED09ed85Dbc1Acc2',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x05C993e60179f28bF649a2Bb5b00b5F4283bD525',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x860e626c700AF381133D9f4aF31412A2d1DB3D5d',
            }
        },
                
    }
})

/**
 * Chain Definition for Lisk Sepolia Testnet  
 * @type {Chain}
 */
export const liskSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Lisk Sepolia Testnet',
    id: 4202,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.sepolia-api.lisk.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Lisk Sepolia Testnet Explorer',
            url: 'https://sepolia-blockscout.lisk.com',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xe3d90F21490686Ec7eF37BE788E02dfC12787264',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x1Fb30e446eA791cd1f011675E5F3f5311b70faF5',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0xb4E988CF1aD8C361D56118437502A8f11C7FaA01',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x857824E6234f7733ecA4e9A76804fd1afa1A3A2C',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xF54791059df4a12BA461b881B4080Ae81a1d0AC0',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x9AA3890a87E6BD2CB85Dad1A5D8B0A9D669e658a',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xA0E35F56C318DE1bD5D9ca6A94Fe7e37C5663348',
            }
        },
                
    }
})

/**
 * Chain Definition for Metal L2 Testnet  
 * @type {Chain}
 */
export const metalSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Metal L2 Testnet',
    id: 1740,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.rpc.metall2.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Metal L2 Testnet Explorer',
            url: 'https://testnet.explorer.metall2.com',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x01D4dfC994878682811b2980653D03E589f093cB',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x21530aAdF4DCFb9c477171400E40d4ef615868BE',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x5d6cE6917dBeeacF010c96BfFdaBE89e33a30309',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x5D335Aa7d93102110879e3B54985c5F08146091E',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x5D63A8Dc2737cE771aa4a6510D063b6Ba2c4f6F2',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x75a6B961c8da942Ee03CA641B09C322549f6FA98',
            }
        },
                
    }
})

/**
 * Chain Definition for Minato  
 * @type {Chain}
 */
export const minatoSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Minato',
    id: 1946,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.minato.soneium.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Minato Explorer',
            url: 'https://soneium-minato.blockscout.com/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x65ea1489741A5D72fFdD8e6485B216bBdcC15Af3',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x5f5a404A5edabcDD80DB05E8e54A78c9EBF000C2',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x2bfb22cd534a462028771a1cA9D6240166e450c4',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x0184245D202724dc28a2b688952Cb56C882c226F',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x4Ca9608Fef202216bc21D543798ec854539bAAd3',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0xB3Ad2c38E6e0640d7ce6aA952AB3A60E81bf7a01',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x710e5286C746eC38beeB7538d0146f60D27be343',
            }
        },
                
    }
})

/**
 * Chain Definition for Mode Testnet  
 * @type {Chain}
 */
export const modeSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Mode Testnet',
    id: 919,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.mode.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Mode Testnet Explorer',
            url: 'https://sepolia.explorer.mode.network',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x320e1580effF37E008F1C92700d1eBa47c1B23fD',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xbC5C679879B2965296756CD959C3C739769995E2',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x015a8c2e0a5fEd579dbb05fd290e413Adc6FC24A',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xc19a60d9E8C27B9A43527c3283B4dd8eDC8bE15C',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x15cd4f6e0CE3B4832B33cB9c6f6Fe6fc246754c2',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x2634BD65ba27AB63811c74A63118ACb312701Bfa',
            }
        },
                
    }
})

/**
 * Chain Definition for OP Sepolia Testnet  
 * @type {Chain}
 */
export const opSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'OP Sepolia Testnet',
    id: 11155420,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.optimism.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'OP Sepolia Testnet Explorer',
            url: 'https://sepolia-optimistic.etherscan.io',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0xd83e03D576d23C9AEab8cC44Fa98d058D2176D1f',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x034edD2A225f7f429A63E0f1D2084B9E0A93b538',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x05F9613aDB30026FFd634f38e5C4dFd30a197Fa1',
            }
        },
                
    }
})

/**
 * Chain Definition for RACE Testnet  
 * @type {Chain}
 */
export const raceSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'RACE Testnet',
    id: 6806,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://racetestnet.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'RACE Testnet Explorer',
            url: 'https://testnet.racescan.io/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xF2891fc6819CDd6BD9221874619BB03A6277d72A',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x289179e9d43A35D47239456251F9c2fdbf9fbeA2',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0xBafb1a6e54e7750aF29489D65888d1c96Dfd66Df',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xdaeab17598938A4f27E50AC771249Ad7df12Ea7D',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x07e7A3F25aA73dA15bc19B71FEF8f5511342a409',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xccac2B8FFc4f778242105F3a9E6B3Ae3F827fC6a',
            }
        },
                
    }
})

/**
 * Chain Definition for Shape Sepolia Testnet  
 * @type {Chain}
 */
export const shapeSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Shape Sepolia Testnet',
    id: 11011,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.shape.network/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Shape Sepolia Testnet Explorer',
            url: 'https://shape-sepolia.explorer.alchemy.com/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xfF8Ca2B4d8122E41441F7ccDCf61b8692198Bd1E',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x341ab1DAFdfB73b3D6D075ef10b29e3cACB2A653',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x19f02c55254d2644eF94f30C74A932D64e1D4F86',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0xF9F730650e1AB4D23E2ac983934271ca7c5EF293',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xa1aC91ED91EbE40E00d61E233c8026318b4da5fb',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x93eaa7A1E7d7af7eD9D612F9957988C8631c33e8',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x532dDCed3440Eab81c529Ac8b0d7e429B5C05c52',
            }
        },
                
    }
})

/**
 * Chain Definition for Binary Sepolia  
 * @type {Chain}
 */
export const tbnSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Binary Sepolia',
    id: 625,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Test BNRY',
        symbol: 'TBNRY',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.testnet.thebinaryholdings.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Binary Sepolia Explorer',
            url: 'https://explorer.sepolia.thebinaryholdings.com',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xFBEd910ca54F013bfeA67Bd4DC836263bdd0b46C',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x3B78C3B41b3e3fC6bdf0bD3060C9E2471401C098',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x7c95EebEA6f68875b4093D9c2211Fd26067a808F',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x33Dc556A5df0B8998dC2640c78E531Ae1dB7925d',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x1a6D0312FaaaCa2BF818660F164450176C6205C9',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x096b38bDC80B5BF5B5Fb4e1A75Ae38BDa520474A',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xF3699f96cBdD3868B64352669805D96d1Fb6431d',
            }
        },
                
    }
})

/**
 * Chain Definition for Unichain Sepolia Testnet  
 * @type {Chain}
 */
export const unichainSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Unichain Sepolia Testnet',
    id: 1301,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.unichain.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Unichain Sepolia Testnet Explorer',
            url: 'https://sepolia.uniscan.xyz',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0x0d83dab629f0e0F9d36c0Cbc89B69a489f0751bD',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x4696b5e042755103fe558738Bcd1ecEe7A45eBfe',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x448A37330A60494E666F6DD60aD48d930AEbA381',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xaeE94b9aB7752D3F7704bDE212c0C6A0b701571D',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0xeff73e5aa3B9AEC32c659Aa3E00444d20a84394b',
            }
        },
                
    }
})

/**
 * Chain Definition for World Chain Sepolia Testnet  
 * @type {Chain}
 */
export const worldchainSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'World Chain Sepolia Testnet',
    id: 4801,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://worldchain-sepolia.g.alchemy.com/public'],
        },
    },
    blockExplorers: {
        default: {
            name: 'World Chain Sepolia Testnet Explorer',
            url: 'https://worldchain-sepolia.explorer.alchemy.com/',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xFf6EBa109271fe6d4237EeeD4bAb1dD9A77dD1A4',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x3580505c56f8560E3777E92Fb27f70fD20c5B493',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x7768c821200554d8F359A8902905Ba9eDe5659a9',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0x166F9406e79A656f12F05247fb8F5DfA6155bCBF',
            }
        },
        disputeGameFactory: {
            [11155111]: {
                address: '0x8cF97Ee616C986a070F5020d973b456D0120C253',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0xc8886f8BAb6Eaeb215aDB5f1c686BF699248300e',
            }
        },
                
    }
})

/**
 * Chain Definition for Zora Sepolia Testnet  
 * @type {Chain}
 */
export const zoraSepolia: Chain = defineChain({
    ...chainConfig,
    name: 'Zora Sepolia Testnet',
    id: 999999999,
    sourceId: 11155111,
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18 
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.rpc.zora.energy'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Zora Sepolia Testnet Explorer',
            url: 'https://sepolia.explorer.zora.energy',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        portal: {
            [11155111]: {
                address: '0xeffE2C6cA9Ab797D418f0D91eA60807713f3536f',
            }
        },
        l1StandardBridge: {
            [11155111]: {
                address: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB',
            }
        },
        l1Erc721Bridge: {
            [11155111]: {
                address: '0x16B0a4f451c4CB567703367e587E15Ac108e4311',
            }
        },
        l1CrossDomainMessenger: {
            [11155111]: {
                address: '0x1bDBC0ae22bEc0c2f08B4dd836944b3E28fe9b7A',
            }
        },
        systemConfig: {
            [11155111]: {
                address: '0xB54c7BFC223058773CF9b739cC5bd4095184Fb08',
            }
        },
        l2OutputOracle: {
            [11155111]: {
                address: '0x2615B481Bd3E5A1C0C7Ca3Da1bdc663E8615Ade9',
            }
        },
                
    }
})

export const sepoliaChains = [
    arenaZSepolia,
    baseSepolia,
    cyberSepolia,
    ethernitySepolia,
    funkiSepolia,
    inkSepolia,
    liskSepolia,
    metalSepolia,
    minatoSepolia,
    modeSepolia,
    opSepolia,
    raceSepolia,
    shapeSepolia,
    tbnSepolia,
    unichainSepolia,
    worldchainSepolia,
    zoraSepolia,
    
]
