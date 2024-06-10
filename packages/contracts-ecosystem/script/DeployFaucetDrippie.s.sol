// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {CheckBalanceLow} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/dripchecks/CheckBalanceLow.sol";
import {Drippie} from "@eth-optimism/contracts-bedrock/src/periphery/drippie/Drippie.sol";

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
        address _faucetDrippieContract = _deployCreate2({
            _name: "FaucetDrippie",
            _creationCode: type(Drippie).creationCode,
            _constructorParams: abi.encode(_faucetDrippieOwner)
        });

        Drippie drippie = Drippie(payable(_faucetDrippieContract));
        require(drippie.owner() == _faucetDrippieOwner);
    }

    /// @notice Deploy CheckBalanceLow contract.
    function deployCheckBalanceLow() public broadcast {
        _deployCreate2({
            _name: "CheckBalanceLow",
            _creationCode: type(CheckBalanceLow).creationCode,
            _constructorParams: hex""
        });
    }

    // @notice Deploys a contract using the CREATE2 opcode.
    // @param _name The name of the contract.
    // @param _creationCode The contract creation code.
    // @param _constructorParams The constructor parameters.
    function _deployCreate2(string memory _name, bytes memory _creationCode, bytes memory _constructorParams)
        internal
        returns (address addr_)
    {
        bytes32 salt = keccak256(bytes(_name));
        bytes memory initCode = abi.encodePacked(_creationCode, _constructorParams);
        address preComputedAddress = vm.computeCreate2Address(salt, keccak256(initCode));
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
