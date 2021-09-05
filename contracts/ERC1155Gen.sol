pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "./ERC721Gen.sol";

contract ERC1155Gen is ERC1155Upgradeable {
    ERC721Gen public erc721;

    function __ERC1155Gen_init_unchained(ERC721Gen _erc721, uint _total, string memory _uri) internal initializer {
        erc721 = _erc721;
        _setURI(_uri);
        _mint(msg.sender, 1, _total, "");
    }

    //todo mint721 - burns and mints 721
    function mint721() public { //todo who can do this?

    }
}
