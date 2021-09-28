// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma abicoder v2;

import "../../contracts/ERC721Gen.sol";

contract ERC721GenTest is ERC721Gen {
    function getMinted() public view returns(uint){
        return minted;
    }
}
