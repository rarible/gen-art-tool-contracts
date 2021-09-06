pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "./ERC721Gen.sol";

//todo default approval
//todo add gaps?
contract ERC1155Gen is ERC1155Upgradeable {
    event Mint721(uint tokenId);

    ERC721Gen public erc721;

    function __ERC1155Gen_init(ERC721Gen _erc721, uint _total, string memory _uri) public initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __ERC1155_init_unchained(_uri);
        __ERC1155Gen_init_unchained(_erc721, _total);
    }

    function __ERC1155Gen_init_unchained(ERC721Gen _erc721, uint _total) internal initializer {
        erc721 = _erc721;
        _mint(msg.sender, 1, _total, "");
    }

    function mint721(address from, address to, uint amount) public {
        require(to != address(0), "ERC1155Gen: mint721 to the zero address");
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155Gen: caller is not owner nor approved"
        );

        _burn(from, 1, amount);
        for (uint i = 0; i < amount; i++) {
            uint tokenId = erc721.mint(to);
            emit Mint721(tokenId);
        }
    }
}
