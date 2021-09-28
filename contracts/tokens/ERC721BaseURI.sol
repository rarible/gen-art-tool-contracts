// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ERC721BaseURI is OwnableUpgradeable {
    // Base URI
    string private _baseURI;

    function __ERC721BaseURI_init_unchained(string memory baseURI_) internal initializer {
        _baseURI = baseURI_;
    }

    /**
    * @dev Returns the base URI set via {_setBaseURI}. This will be
    * automatically added as a prefix in {tokenURI} to each token's URI, or
    * to the token ID if no specific URI is set for that token ID.
    */
    function baseURI() public view virtual returns (string memory) {
        return _baseURI;
    }

    uint256[50] private __gap;
}
