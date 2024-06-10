// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {ProxyAdmin} from "@eth-optimism/contracts-bedrock/src/universal/ProxyAdmin.sol";
import {Proxy} from "@eth-optimism/contracts-bedrock/src/universal/Proxy.sol";
import {Faucet} from "@eth-optimism/contracts-bedrock/src/periphery/faucet/Faucet.sol";
import {AdminFaucetAuthModule} from
    "@eth-optimism/contracts-bedrock/src/periphery/faucet/authmodules/AdminFaucetAuthModule.sol";

import {DeployHelper} from "script/DeployHelper.sol";

contract DeployFaucet is Script {
    uint256 _deployerPrivateKey;
    uint256 _proxyAdminOwnerPrivateKey;
    uint256 _faucetAdminPrivateKey;
    uint256 _faucetOnchainAuthModuleTtl;
    uint256 _faucetOnchainAuthModuleAmount;
    uint256 _faucetOffchainAuthModuleTtl;
    uint256 _faucetOffchainAuthModuleAmount;

    address _faucetAdmin;
    address _proxyAdminOwner;
    address _proxyAdminContract;
    address _faucetProxyContract;
    address _faucetContract;
    address _faucetOnchainAuthModuleAdmin;
    address _onChainAuthModuleContract;
    address _faucetOffchainAuthModuleAdmin;
    address _offChainAuthModuleContract;

    function setUp() public {
        _deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        _proxyAdminOwnerPrivateKey = vm.envUint("PROXY_ADMIN_OWNER_PRIVATE_KEY");
        _proxyAdminOwner = vm.createWallet(_proxyAdminOwnerPrivateKey).addr;

        _faucetOnchainAuthModuleAmount = vm.envUint("FAUCET_ON_CHAIN_AUTH_MODULE_AMOUNT");
        _faucetOnchainAuthModuleTtl = vm.envUint("FAUCET_ON_CHAIN_AUTH_MODULE_TTL");
        _faucetOffchainAuthModuleAmount = vm.envUint("FAUCET_OFF_CHAIN_AUTH_MODULE_AMOUNT");
        _faucetOffchainAuthModuleTtl = vm.envUint("FAUCET_OFF_CHAIN_AUTH_MODULE_TTL");

        _faucetAdminPrivateKey = vm.envUint("FAUCET_ADMIN_PRIVATE_KEY");
        _faucetAdmin = vm.createWallet(_faucetAdminPrivateKey).addr;

        _faucetOnchainAuthModuleAdmin = vm.envAddress("FAUCET_ON_CHAIN_AUTH_MODULE_ADMIN");
        _faucetOffchainAuthModuleAdmin = vm.envAddress("FAUCET_OFF_CHAIN_AUTH_MODULE_ADMIN");
    }

    function run() public {
        console.log("Deploying all faucet contracts");

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
        vm.startBroadcast(_deployerPrivateKey);
        _;
        vm.stopBroadcast();
    }

    /// @notice Deploy the ProxyAdmin
    function deployProxyAdmin() public broadcast returns (address addr_) {
        _proxyAdminContract = DeployHelper.deployCreate2({
            _name: "ProxyAdmin",
            _creationCode: type(ProxyAdmin).creationCode,
            _constructorParams: abi.encode(_proxyAdminOwner)
        });

        require(ProxyAdmin(payable(_proxyAdminContract)).owner() == _proxyAdminOwner);

        addr_ = _proxyAdminContract;
    }

    /// @notice Deploy the FaucetProxy
    function deployFaucetProxy() public broadcast returns (address addr_) {
        _faucetProxyContract = DeployHelper.deployCreate2({
            _name: "FaucetProxy",
            _creationCode: type(Proxy).creationCode,
            _constructorParams: abi.encode(_proxyAdminContract)
        });

        addr_ = _faucetProxyContract;
    }

    /// @notice Deploy the faucet contract.
    function deployFaucet() public broadcast returns (address addr_) {
        _faucetContract = DeployHelper.deployCreate2({
            _name: "Faucet",
            _creationCode: type(Faucet).creationCode,
            _constructorParams: abi.encode(_faucetAdmin)
        });

        require(Faucet(payable(_faucetContract)).ADMIN() == _faucetAdmin);

        addr_ = _faucetContract;
    }

    /// @notice Initialize the Faucet
    function initializeFaucet() public {
        vm.startBroadcast(_proxyAdminOwnerPrivateKey);

        ProxyAdmin proxyAdmin = ProxyAdmin(_proxyAdminContract);
        address implementationAddress = proxyAdmin.getProxyImplementation(_faucetProxyContract);
        if (implementationAddress == _faucetContract) {
            console.log("Faucet proxy implementation already set");
        } else {
            proxyAdmin.upgrade({_proxy: payable(_faucetProxyContract), _implementation: _faucetContract});
        }

        require(Faucet(payable(_faucetProxyContract)).ADMIN() == Faucet(payable(_faucetContract)).ADMIN());

        vm.stopBroadcast();
    }

    /// @notice deploys the On-Chain Authentication Module
    function deployOnChainAuthModule() public broadcast returns (address addr_) {
        string memory moduleName = "OnChainAuthModule";
        string memory version = "1";
        _onChainAuthModuleContract = DeployHelper.deployCreate2({
            _name: "OnChainAuthModule",
            _creationCode: type(AdminFaucetAuthModule).creationCode,
            _constructorParams: abi.encode(_faucetOnchainAuthModuleAdmin, moduleName, version)
        });

        require(AdminFaucetAuthModule(payable(_onChainAuthModuleContract)).ADMIN() == _faucetOnchainAuthModuleAdmin);

        addr_ = _onChainAuthModuleContract;
    }

    /// @notice deploys the Off-Chain Authentication Module
    function deployOffChainAuthModule() public broadcast returns (address addr_) {
        string memory moduleName = "OffChainAuthModule";
        string memory version = "1";
        _offChainAuthModuleContract = DeployHelper.deployCreate2({
            _name: "OffChainAuthModule",
            _creationCode: type(AdminFaucetAuthModule).creationCode,
            _constructorParams: abi.encode(_faucetOffchainAuthModuleAdmin, moduleName, version)
        });

        require(AdminFaucetAuthModule(payable(_offChainAuthModuleContract)).ADMIN() == _faucetOffchainAuthModuleAdmin);

        addr_ = _offChainAuthModuleContract;
    }

    /// @notice installs the OnChain AuthModule on the Faucet contract.
    function installOnChainAuthModule() public {
        string memory moduleName = "OnChainAuthModule";
        Faucet faucet = Faucet(payable(_faucetProxyContract));
        AdminFaucetAuthModule onChainAuthModule = AdminFaucetAuthModule(payable(_onChainAuthModuleContract));
        if (faucet.isModuleEnabled(onChainAuthModule)) {
            console.log("%s already installed.", moduleName);
        } else {
            console.log("Installing %s", moduleName);
            Faucet.ModuleConfig memory myModuleConfig = Faucet.ModuleConfig({
                name: moduleName,
                enabled: true,
                ttl: _faucetOnchainAuthModuleTtl,
                amount: _faucetOnchainAuthModuleAmount
            });
            faucet.configure(onChainAuthModule, myModuleConfig);
            console.log("%s installed successfully", moduleName);
        }
    }

    /// @notice installs the OffChain AuthModule on the Faucet contract.
    function installOffChainAuthModule() public {
        string memory moduleName = "OffChainAuthModule";
        Faucet faucet = Faucet(payable(_faucetProxyContract));
        AdminFaucetAuthModule offChainAuthModule = AdminFaucetAuthModule(payable(_offChainAuthModuleContract));
        if (faucet.isModuleEnabled(offChainAuthModule)) {
            console.log("%s already installed.", moduleName);
        } else {
            console.log("Installing %s", moduleName);
            Faucet.ModuleConfig memory myModuleConfig = Faucet.ModuleConfig({
                name: moduleName,
                enabled: true,
                ttl: _faucetOffchainAuthModuleTtl,
                amount: _faucetOffchainAuthModuleAmount
            });
            faucet.configure(offChainAuthModule, myModuleConfig);
            console.log("%s installed successfully", moduleName);
        }
    }

    /// @notice installs all of the auth module in the faucet contract.
    function installFaucetAuthModulesConfigs() public {
        Faucet faucet = Faucet(payable(_faucetProxyContract));
        console.log("Installing auth modules at %s", address(faucet));
        vm.startBroadcast(_faucetAdminPrivateKey);
        installOnChainAuthModule();
        installOffChainAuthModule();
        vm.stopBroadcast();

        console.log("Faucet Auth Module configs successfully installed");
    }
}
