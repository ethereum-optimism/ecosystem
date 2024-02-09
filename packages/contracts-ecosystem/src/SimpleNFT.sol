// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "solady/tokens/ERC721.sol";
import {LibString} from "solady/utils/LibString.sol";
import {Base64} from "solady/utils/Base64.sol";

contract SimpleNFT is ERC721 {
    string public constant SVG_PREFIX =
    // solhint-disable-next-line max-line-length
        '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 400"><style>.text { fill: white; font-family: monospace }</style><rect width="100%" height="100%" fill="#ea3431" ry="20" rx="20"/><text class="text" font-weight="bold" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="32" y="15%" x="50%">SimpleNFT</text>';

    uint256 public currentTokenId;

    function name() public view virtual override returns (string memory) {
        return "SimpleNFT";
    }

    function symbol() public view virtual override returns (string memory) {
        return "SNFT";
    }

    function mintTo(address _to) public returns (uint256) {
        uint256 newTokenId = currentTokenId++;
        _safeMint(_to, newTokenId);
        return newTokenId;
    }

    function mint() public returns (uint256) {
        return mintTo(msg.sender);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return _getTokenUri(id, ownerOf(id));
    }

    function _getTokenUri(uint256 _tokenId, address _tokenOwner) internal pure returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "SimpleNFT #',
            LibString.toString(_tokenId),
            '",',
            '"description": "Simple, ugly, onchain-rendered NFT for testing purposes",',
            '"image": "',
            _renderSvg(_tokenOwner, _tokenId),
            '"',
            "}"
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function _renderSvg(address _tokenOwner, uint256 _tokenId) internal pure returns (string memory) {
        bytes memory svg = abi.encodePacked(
            SVG_PREFIX,
            // solhint-disable-next-line max-line-length
            '<text class="text" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" y="50%" x="50%">#',
            LibString.toString(_tokenId),
            "</text>",
            '<text class="text" dominant-baseline="middle" text-anchor="middle" font-size="14" y="90%" x="50%">',
            LibString.toHexString(_tokenOwner),
            "</text>",
            "</svg>"
        );

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
    }
}
