// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {SimpleNFT} from "../src/contracts/SimpleNFT.sol";

contract SimpleNFTTest is Test {
    SimpleNFT public simpleNFT;
    address bob;
    address sally;

    function setUp() public {
        simpleNFT = new SimpleNFT();

        bob = makeAddr("bob");
        sally = makeAddr("sally");
    }

    function test_mint_mintToMsgSender_succeeds() public {
        vm.prank(bob);
        simpleNFT.mint();

        assertEq(simpleNFT.balanceOf(bob), 1);
    }

    function test_mint_mintToSomeoneElse_succeeds() public {
        vm.prank(bob);
        simpleNFT.mintTo(sally);

        assertEq(simpleNFT.balanceOf(bob), 0);
        assertEq(simpleNFT.balanceOf(sally), 1);
    }
}
