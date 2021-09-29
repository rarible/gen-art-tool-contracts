// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/introspection/ERC165Upgradeable.sol";

import "../utils/AddAddrToURI.sol";

contract ERC721URI is OwnableUpgradeable, ERC165Upgradeable, AddAddrToURI {
    // Base URI
    string private _baseURI;

    /*
     * bytes4(keccak256('contractURI()')) == 0xe8a3d485
     */
    bytes4 private constant _INTERFACE_ID_CONTRACT_URI = 0xe8a3d485;

    function __ERC721URI_init_unchained(string memory baseURI_) internal initializer {
        _baseURI = baseURI_;
        _registerInterface(_INTERFACE_ID_CONTRACT_URI);
    }

    // returns baseURI/{token address}/
    function baseURI() public view virtual returns (string memory) {
      return string(abi.encodePacked(_baseURI, "0x", toAsciiString(address(this)), "/"));
    }

    // returns baseURI/meta/{token address}
    function contractURI() external view returns (string memory) {
      return string(abi.encodePacked(_baseURI, "meta/0x", toAsciiString(address(this))));
    }

    uint256[50] private __gap;
}
