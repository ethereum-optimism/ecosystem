// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SimpleNFT} from "../src/SimpleNFT.sol";

contract DeploySimpleNFT is Script {
    address constant EXPECTED_SIMPLE_NFT_ADDRESS = 0xCff4770B208358661f7350Abe77900C25b0C2b95;

    function setUp() public {}

    function run() public {
        bytes32 salt = keccak256(bytes("SimpleNFT"));

        vm.startBroadcast();
        if (EXPECTED_SIMPLE_NFT_ADDRESS.code.length == 0) {
            SimpleNFT simpleNFT = new SimpleNFT{salt: salt}();
            console.log("SimpleNFT deployed at address: %s", address(simpleNFT));
        } else {
            console.log("SimpleNFT already deployed at address: %s", EXPECTED_SIMPLE_NFT_ADDRESS);
        }
        vm.stopBroadcast();
    }
}
