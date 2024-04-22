// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SimpleNFT} from "../src/SimpleNFT.sol";

contract DeployConsoleApiTestEnv is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        bytes32 salt = keccak256(bytes("TestSalt"));
        
        console.log("Deploying contracts with create");
        deployContracts();

        console.log("Deploying contracts with create2");
        deployCreate2Contracts(salt);

        vm.stopBroadcast();
    }

    function deployContracts() internal {
        for (uint256 i = 0; i < 10; i++) {
            new SimpleNFT();
        }
    }

    function deployCreate2Contracts(bytes32 salt) internal {
        new SimpleNFT{salt: salt}();
    }
}
