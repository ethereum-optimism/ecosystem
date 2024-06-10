// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {CheckBalanceLow} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/dripchecks/CheckBalanceLow.sol";
import {Drippie} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/Drippie.sol";

import {DeployHelper} from "script/DeployHelper.sol";

contract DeployFaucetDrippie is Script {
    uint256 _deployerPrivateKey;

    address _faucetDrippieOwner;

    function setUp() public {
        _deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        _faucetDrippieOwner = vm.envAddress("FAUCET_DRIPPIE_OWNER_ADDRESS");
    }

    function run() public {
        console.log("Deploying all drippie contracts");

        deployFaucetDrippie();
        deployCheckBalanceLow();
    }

    /// @notice Modifier that wraps a function in broadcasting.
    modifier broadcast() {
        vm.startBroadcast(_deployerPrivateKey);
        _;
        vm.stopBroadcast();
    }

    /// @notice Deploy the Drippie contract.
    function deployFaucetDrippie() public broadcast {
        address _faucetDrippieContract = DeployHelper.deployCreate2({
            _name: "FaucetDrippie",
            _creationCode: type(Drippie).creationCode,
            _constructorParams: abi.encode(_faucetDrippieOwner)
        });

        Drippie drippie = Drippie(payable(_faucetDrippieContract));
        require(drippie.owner() == _faucetDrippieOwner);
    }

    /// @notice Deploy CheckBalanceLow contract.
    function deployCheckBalanceLow() public broadcast {
        DeployHelper.deployCreate2({
            _name: "CheckBalanceLow",
            _creationCode: type(CheckBalanceLow).creationCode,
            _constructorParams: hex""
        });
    }
}
