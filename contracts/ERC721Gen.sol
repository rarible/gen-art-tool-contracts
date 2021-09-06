pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./Traits.sol";

//todo default approvals (so no approval is needed for trades)
//todo gaps?
contract ERC721Gen is ERC721Upgradeable, Traits {

    mapping(uint => uint) mintingBlocks;
    mapping(uint => uint[]) tokenTraits;

    function __ERC721Gen_init(string memory _name, string memory _symbol, Trait[] memory _traits) public initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __ERC721_init_unchained(_name, _symbol);
        __Traits_init_unchained(_traits);
    }

    function mint(address to) public returns (uint) { //todo operatorOnly
        uint[] memory generated = generateRandomTraits();
        uint tokenId = random(0);
        _safeMint(to, tokenId);
        tokenTraits[tokenId] = generated;
        mintingBlocks[tokenId] = block.number;
        return tokenId;
    }

    function getTokenTraits(uint tokenId) view public returns (uint[] memory) {
        require(block.number > mintingBlocks[tokenId], "can't read traits in the same block");
        return tokenTraits[tokenId];
    }
}
