pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./Traits.sol";

contract ERC721Gen is ERC721Upgradeable, Traits {

    mapping(uint => uint16) tokenTraits; //todo сделать, чтобы нельзя было читать во время минтинга

    function __ERC721Gen_init(string memory _name, string memory _symbol, Trait[] memory _traits) public initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __ERC721_init_unchained(_name, _symbol);
        __Traits_init_unchained(_traits);
    }

    function mint(address to) public {//todo operatorOnly
    }

}
