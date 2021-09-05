pragma solidity ^0.7.0;

import "../../contracts/ERC721Gen.sol";

contract ERC721GenTest {
    event TokenId(uint value);
    event Traits(uint16[] traits);

    function mintAndGetTraits(ERC721Gen token, address to, bool getTraits) public {
        uint tokenId = token.mint(to);
        emit TokenId(tokenId);
        if (getTraits) {
            emit Traits(token.getTokenTraits(tokenId));
        }
    }
}
