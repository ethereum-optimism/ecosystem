// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Vm} from "forge-std/Vm.sol";
import {console} from "forge-std/console.sol";

/// @title DeployHelper
/// @notice Library for deploying contracts.
library DeployHelper {
    /// @notice Foundry cheatcode VM.
    Vm private constant VM = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    // @notice Deploys a contract using the CREATE2 opcode.
    // @param _name The name of the contract.
    // @param _creationCode The contract creation code.
    // @param _constructorParams The constructor parameters.

    function deployCreate2(string memory _name, bytes memory _creationCode, bytes memory _constructorParams)
        public
        returns (address addr_)
    {
        bytes32 salt = keccak256(bytes(_name));
        bytes memory initCode = abi.encodePacked(_creationCode, _constructorParams);
        address preComputedAddress = VM.computeCreate2Address(salt, keccak256(initCode));
        if (preComputedAddress.code.length > 0) {
            console.log("%s already deployed at %s", _name, preComputedAddress);
            addr_ = preComputedAddress;
        } else {
            assembly {
                addr_ := create2(0, add(initCode, 0x20), mload(initCode), salt)
            }
            require(addr_ != address(0), "deployment failed");
            console.log("%s deployed at %s", _name, addr_);
        }
    }
}
