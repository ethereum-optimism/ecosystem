// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from 'forge-std/Script.sol';
import {console} from 'forge-std/console.sol';

import {ProxyAdmin} from '@eth-optimism/contracts-bedrock/src/universal/ProxyAdmin.sol';
import {Proxy} from '@eth-optimism/contracts-bedrock/src/universal/Proxy.sol';
import {Faucet} from '@eth-optimism/contracts-bedrock/src/periphery/faucet/Faucet.sol';
import {AdminFaucetAuthModule} from '@eth-optimism/contracts-bedrock/src/periphery/faucet/authmodules/AdminFaucetAuthModule.sol';

contract DeployFaucet is Script {
  uint256 deployerPrivateKey;
  uint256 proxyAdminOwnerPrivateKey;
  uint256 faucetAdminPrivateKey;
  uint256 faucetOnchainAuthModuleTtl;
  uint256 faucetOnchainAuthModuleAmount;
  uint256 faucetOffchainAuthModuleTtl;
  uint256 faucetOffchainAuthModuleAmount;

  address faucetAdmin;
  address proxyAdminOwner;
  address proxyAdminContract;
  address faucetProxyContract;
  address faucetContract;
  address faucetOnchainAuthModuleAdmin;
  address onChainAuthModuleContract;
  address faucetOffchainAuthModuleAdmin;
  address offChainAuthModuleContract;

  function setUp() public {
    deployerPrivateKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

    proxyAdminOwnerPrivateKey = vm.envUint('PROXY_ADMIN_OWNER_PRIVATE_KEY');
    proxyAdminOwner = vm.createWallet(proxyAdminOwnerPrivateKey).addr;

    faucetOnchainAuthModuleAmount = vm.envUint(
      'FAUCET_ON_CHAIN_AUTH_MODULE_AMOUNT'
    );
    faucetOnchainAuthModuleTtl = vm.envUint('FAUCET_ON_CHAIN_AUTH_MODULE_TTL');
    faucetOffchainAuthModuleAmount = vm.envUint(
      'FAUCET_OFF_CHAIN_AUTH_MODULE_AMOUNT'
    );
    faucetOffchainAuthModuleTtl = vm.envUint(
      'FAUCET_OFF_CHAIN_AUTH_MODULE_TTL'
    );

    faucetAdminPrivateKey = vm.envUint('FAUCET_ADMIN_PRIVATE_KEY');
    faucetAdmin = vm.createWallet(faucetAdminPrivateKey).addr;

    faucetOnchainAuthModuleAdmin = vm.envAddress(
      'FAUCET_ON_CHAIN_AUTH_MODULE_ADMIN'
    );
    faucetOffchainAuthModuleAdmin = vm.envAddress(
      'FAUCET_OFF_CHAIN_AUTH_MODULE_ADMIN'
    );
  }

  function run() public {
    console.log('Deploying all periphery contracts');

    deployProxies();
    deployImplementations();

    initializeFaucet();
    installFaucetAuthModulesConfigs();
  }

  /// @notice Deploy all of the proxies
  function deployProxies() public {
    deployProxyAdmin();
    deployFaucetProxy();
  }

  /// @notice Deploy all of the implementations
  function deployImplementations() public {
    deployFaucet();
    deployOnChainAuthModule();
    deployOffChainAuthModule();
  }

  /// @notice Modifier that wraps a function in broadcasting.
  modifier broadcast() {
    vm.startBroadcast(deployerPrivateKey);
    _;
    vm.stopBroadcast();
  }

  /// @notice Deploy the ProxyAdmin
  function deployProxyAdmin() public broadcast returns (address addr_) {
    bytes32 salt = keccak256(bytes('ProxyAdmin'));
    bytes32 initCodeHash = keccak256(
      abi.encodePacked(
        type(ProxyAdmin).creationCode,
        abi.encode(proxyAdminOwner)
      )
    );
    proxyAdminContract = vm.computeCreate2Address(salt, initCodeHash);
    console.log('computeCreate2Address %s', proxyAdminContract);
    if (proxyAdminContract.code.length > 0) {
      console.log('ProxyAdmin already deployed at %s', proxyAdminContract);
      addr_ = proxyAdminContract;
    } else {
      ProxyAdmin admin = new ProxyAdmin{salt: salt}({_owner: proxyAdminOwner});
      require(admin.owner() == proxyAdminOwner);

      proxyAdminContract = address(admin);
      console.log('ProxyAdmin deployed at %s', address(admin));

      addr_ = address(admin);
    }
  }

  /// @notice Deploy the FaucetProxy
  function deployFaucetProxy() public broadcast returns (address addr_) {
    bytes32 salt = keccak256(bytes('FaucetProxy'));
    bytes32 initCodeHash = keccak256(
      abi.encodePacked(type(Proxy).creationCode, abi.encode(proxyAdminContract))
    );
    address preComputedAddress = vm.computeCreate2Address(salt, initCodeHash);
    if (preComputedAddress.code.length > 0) {
      console.log('FaucetProxy already deployed at %s', preComputedAddress);
      faucetProxyContract = preComputedAddress;
      addr_ = preComputedAddress;
    } else {
      Proxy proxy = new Proxy{salt: salt}({_admin: proxyAdminContract});

      faucetProxyContract = address(proxy);
      console.log('FaucetProxy deployed at %s', address(proxy));

      addr_ = address(proxy);
    }
  }

  /// @notice Deploy the faucet contract.
  function deployFaucet() public broadcast returns (address addr_) {
    bytes32 salt = keccak256(bytes('Faucet'));
    bytes32 initCodeHash = keccak256(
      abi.encodePacked(type(Faucet).creationCode, abi.encode(faucetAdmin))
    );
    address preComputedAddress = vm.computeCreate2Address(salt, initCodeHash);
    if (preComputedAddress.code.length > 0) {
      console.log('Faucet already deployed at %s', preComputedAddress);
      faucetContract = preComputedAddress;
      addr_ = preComputedAddress;
    } else {
      Faucet faucet = new Faucet{salt: salt}(faucetAdmin);
      require(faucet.ADMIN() == faucetAdmin);

      faucetContract = address(faucet);
      console.log('Faucet deployed at %s', address(faucet));

      addr_ = address(faucet);
    }
  }

  /// @notice Initialize the Faucet
  function initializeFaucet() public {
    vm.startBroadcast(proxyAdminOwnerPrivateKey);

    ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminContract);
    address implementationAddress = proxyAdmin.getProxyImplementation(
      faucetProxyContract
    );
    if (implementationAddress == faucetContract) {
      console.log('Faucet proxy implementation already set');
    } else {
      proxyAdmin.upgrade({
        _proxy: payable(faucetProxyContract),
        _implementation: faucetContract
      });
    }

    require(
      Faucet(payable(faucetProxyContract)).ADMIN() ==
        Faucet(payable(faucetContract)).ADMIN()
    );

    vm.stopBroadcast();
  }

  /// @notice deploys the On-Chain Authentication Module
  function deployOnChainAuthModule() public broadcast returns (address addr_) {
    string memory moduleName = 'OnChainAuthModule';
    string memory version = '1';
    bytes32 salt = keccak256(bytes('OnChainAuthModule'));
    bytes32 initCodeHash = keccak256(
      abi.encodePacked(
        type(AdminFaucetAuthModule).creationCode,
        abi.encode(faucetOnchainAuthModuleAdmin, moduleName, version)
      )
    );
    address preComputedAddress = vm.computeCreate2Address(salt, initCodeHash);
    if (preComputedAddress.code.length > 0) {
      console.log(
        'OnChainAuthModule already deployed at %s',
        preComputedAddress
      );
      onChainAuthModuleContract = preComputedAddress;
      addr_ = preComputedAddress;
    } else {
      AdminFaucetAuthModule onChainAuthModule = new AdminFaucetAuthModule{
        salt: salt
      }(faucetOnchainAuthModuleAdmin, moduleName, version);
      require(onChainAuthModule.ADMIN() == faucetOnchainAuthModuleAdmin);

      onChainAuthModuleContract = address(onChainAuthModule);
      console.log(
        'OnChainAuthModule deployed at %s',
        address(onChainAuthModule)
      );

      addr_ = address(onChainAuthModule);
    }
  }

  /// @notice deploys the Off-Chain Authentication Module
  function deployOffChainAuthModule() public broadcast returns (address addr_) {
    string memory moduleName = 'OffChainAuthModule';
    string memory version = '1';
    bytes32 salt = keccak256(bytes('OffChainAuthModule'));
    bytes32 initCodeHash = keccak256(
      abi.encodePacked(
        type(AdminFaucetAuthModule).creationCode,
        abi.encode(faucetOffchainAuthModuleAdmin, moduleName, version)
      )
    );
    address preComputedAddress = computeCreate2Address(salt, initCodeHash);
    if (preComputedAddress.code.length > 0) {
      console.logBytes32(initCodeHash);
      console.log(
        'OffChainAuthModule already deployed at %s',
        preComputedAddress
      );
      offChainAuthModuleContract = preComputedAddress;
      addr_ = preComputedAddress;
    } else {
      AdminFaucetAuthModule offChainAuthModule = new AdminFaucetAuthModule{
        salt: salt
      }(faucetOffchainAuthModuleAdmin, moduleName, version);
      require(offChainAuthModule.ADMIN() == faucetOffchainAuthModuleAdmin);

      offChainAuthModuleContract = address(offChainAuthModule);
      console.log(
        'OffChainAuthModule deployed at %s',
        address(offChainAuthModule)
      );

      addr_ = address(offChainAuthModule);
    }
  }

  /// @notice installs the OnChain AuthModule on the Faucet contract.
  function installOnChainAuthModule() public {
    string memory moduleName = 'OnChainAuthModule';
    Faucet faucet = Faucet(payable(faucetProxyContract));
    AdminFaucetAuthModule onChainAuthModule = AdminFaucetAuthModule(
      payable(onChainAuthModuleContract)
    );
    if (faucet.isModuleEnabled(onChainAuthModule)) {
      console.log('%s already installed.', moduleName);
    } else {
      console.log('Installing %s', moduleName);
      Faucet.ModuleConfig memory myModuleConfig = Faucet.ModuleConfig({
        name: moduleName,
        enabled: true,
        ttl: faucetOnchainAuthModuleTtl,
        amount: faucetOnchainAuthModuleAmount
      });
      faucet.configure(onChainAuthModule, myModuleConfig);
      console.log('%s installed successfully', moduleName);
    }
  }

  /// @notice installs the OffChain AuthModule on the Faucet contract.
  function installOffChainAuthModule() public {
    string memory moduleName = 'OffChainAuthModule';
    Faucet faucet = Faucet(payable(faucetProxyContract));
    AdminFaucetAuthModule offChainAuthModule = AdminFaucetAuthModule(
      payable(offChainAuthModuleContract)
    );
    if (faucet.isModuleEnabled(offChainAuthModule)) {
      console.log('%s already installed.', moduleName);
    } else {
      console.log('Installing %s', moduleName);
      Faucet.ModuleConfig memory myModuleConfig = Faucet.ModuleConfig({
        name: moduleName,
        enabled: true,
        ttl: faucetOffchainAuthModuleTtl,
        amount: faucetOffchainAuthModuleAmount
      });
      faucet.configure(offChainAuthModule, myModuleConfig);
      console.log('%s installed successfully', moduleName);
    }
  }

  /// @notice installs all of the auth module in the faucet contract.
  function installFaucetAuthModulesConfigs() public {
    Faucet faucet = Faucet(payable(faucetProxyContract));
    console.log('Installing auth modules at %s', address(faucet));
    vm.startBroadcast(faucetAdminPrivateKey);
    installOnChainAuthModule();
    installOffChainAuthModule();
    vm.stopBroadcast();

    console.log('Faucet Auth Module configs successfully installed');
  }
}
