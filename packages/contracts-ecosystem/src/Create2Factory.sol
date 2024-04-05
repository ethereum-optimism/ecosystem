pragma solidity ^0.8.24;

import {StdUtils} from "forge-std/StdUtils.sol";

contract Create2Factory {
    event DeployedContract(address indexed addr);

    function deploy(bytes memory bytecode, bytes32 salt) public {
        address deployedAddress;

        assembly {
            deployedAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)

            if iszero(extcodesize(deployedAddress)) { revert(0, 0) }
        }

        emit DeployedContract(deployedAddress);
    }

    function computeAddress(bytes memory bytecode, bytes32 salt) public view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode)));

        return address(uint160(uint256(hash)));
    }
}
