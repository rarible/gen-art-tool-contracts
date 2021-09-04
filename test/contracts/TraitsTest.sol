pragma solidity ^0.7.0;
pragma abicoder v2;

import "../../contracts/Traits.sol";

contract TraitsTest is Traits {
    function __TraitsTest_init(Trait[] memory _traits) public initializer {
        __Traits_init_unchained(_traits);
    }

    function _testGenerateRandomTraits() public view returns (uint16[] memory) {
        return generateRandomTraits();
    }

    function _testGetTraitValue(Trait memory trait, uint rnd) public pure returns (uint) {
        return getTraitValue(trait, rnd);
    }

    function _testRandom(uint seed, uint modulus) public view returns (uint) {
        return random(seed, modulus);
    }
}
