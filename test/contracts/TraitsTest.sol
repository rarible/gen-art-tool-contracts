// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma abicoder v2;

import "../../contracts/traits/TraitsManager.sol";

contract TraitsTest is TraitsManager {

    function __TraitsTest_init(Trait[] memory _traits) external initializer {
        __TraitsManager_init_unchained(_traits);
    }

    function _testGetTraitValue(Trait memory trait, uint rnd) public pure returns (uint) {
        return getTraitValue(trait, rnd);
    }

    function _testRandom(uint seed, uint modulus) public view returns (uint) {
        return random(seed, 10000, msg.sender) % modulus;
    }

    function _testGetRandom(uint tokenId, uint i) public pure returns (uint) {
        return getRandom(tokenId, i);
    }
}
