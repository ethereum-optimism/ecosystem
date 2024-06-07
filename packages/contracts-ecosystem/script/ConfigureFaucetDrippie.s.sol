// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {CheckBalanceLow} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/dripchecks/CheckBalanceLow.sol";
import {Drippie} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/Drippie.sol";

contract ConfigureFaucetDrippie is Script {
    uint256 _faucetDrippieOwnerPrivateKey;

    address _faucetProxyContract;
    address _faucetAuthModuleAdmin;
    address _faucetDrippieContract;
    address _checkBalanceLowContract;

    function setUp() public {
        _faucetDrippieOwnerPrivateKey = vm.envUint("FAUCET_DRIPPIE_OWNER_PRIVATE_KEY");

        _faucetProxyContract = vm.envAddress("FAUCET_PROXY_CONTRACT_ADDRESS");
        _faucetDrippieContract = vm.envAddress("FAUCET_DRIPPIE_CONTRACT_ADDRESS");
        _checkBalanceLowContract = vm.envAddress("CHECK_BALANCE_LOW_CONTRACT_ADDRESS");
        _faucetAuthModuleAdmin = vm.envAddress("FAUCET_AUTH_MODULE_ADMIN_ADDRESS");
    }

    function run() public {
        console.log("Configuring Drippie");

        installFaucetDripV1();
        installFaucetDripV2();
        installFaucetAuthModuleAdminDripV1();
    }

    /// @notice Modifier that wraps a function so that it broadcastings the deployer.
    modifier broadcast() {
        vm.startBroadcast(_faucetDrippieOwnerPrivateKey);
        _;
        vm.stopBroadcast();
    }

    /// @notice Installs the DevConsoleFaucetDripV1 drip on the faucet drippie contract.
    function installFaucetDripV1() public broadcast {
        _installBalanceLowDrip({
            _drippie: Drippie(payable(_faucetDrippieContract)),
            _name: "DevConsoleFaucetDripV1",
            _target: payable(_faucetProxyContract),
            // 20 Ether
            _value: 20000000000000000000,
            // 1 hour
            _interval: 3600,
            // 100 Ether
            _threshold: 100000000000000000000
        });
    }

    /// @notice Installs the DevConsoleFaucetDripV2 drip on the faucet drippie contract.
    function installFaucetDripV2() public broadcast {
        _installBalanceLowDrip({
            _drippie: Drippie(payable(_faucetDrippieContract)),
            _name: "DevConsoleFaucetDripV2",
            _target: payable(_faucetProxyContract),
            // 500 ether
            _value: 500000000000000000000,
            // 7 days
            _interval: 604800,
            // 20 Ether
            _threshold: 20000000000000000000
        });
    }

    /// @notice Installs the DevConsoleFamAdminDripV1 drip on the faucet drippie contract.
    function installFaucetAuthModuleAdminDripV1() public broadcast {
        _installBalanceLowDrip({
            _drippie: Drippie(payable(_faucetDrippieContract)),
            _name: "DevConsoleFamAdminDripV1",
            _target: payable(_faucetAuthModuleAdmin),
            // 1 ether
            _value: 1000000000000000000,
            // 1 day
            _interval: 86400,
            // 0.1 ether
            _threshold: 100000000000000000
        });
    }

    /// @notice Installs a drip that sends ETH to an address if the balance is below a threshold.
    /// @param _drippie The drippie contract.
    /// @param _name The name of the drip.
    /// @param _target The target address.
    /// @param _value The amount of ETH to send.
    /// @param _interval The interval that must elapse between drips.
    /// @param _threshold The balance threshold.
    function _installBalanceLowDrip(
        Drippie _drippie,
        string memory _name,
        address payable _target,
        uint256 _value,
        uint256 _interval,
        uint256 _threshold
    ) internal {
        Drippie.DripAction[] memory actions = new Drippie.DripAction[](1);
        actions[0] = Drippie.DripAction({target: _target, data: "", value: _value});
        _installDrip({
            _drippie: _drippie,
            _name: _name,
            _config: Drippie.DripConfig({
                reentrant: false,
                interval: _interval,
                dripcheck: CheckBalanceLow(_checkBalanceLowContract),
                checkparams: abi.encode(CheckBalanceLow.Params({target: _target, threshold: _threshold})),
                actions: actions
            })
        });
    }

    /// @notice Installs a drip in the drippie contract.
    /// @param _drippie The drippie contract.
    /// @param _name The name of the drip.
    /// @param _config The configuration of the drip.
    function _installDrip(Drippie _drippie, string memory _name, Drippie.DripConfig memory _config) internal {
        if (_drippie.getDripStatus(_name) == Drippie.DripStatus.NONE) {
            console.log("installing %s", _name);
            _drippie.create(_name, _config);
            // Attempt to activate the drip.
            _drippie.status(_name, Drippie.DripStatus.ACTIVE);
            console.log("%s installed successfully", _name);
        } else {
            console.log("%s already installed", _name);
        }
    }
}
