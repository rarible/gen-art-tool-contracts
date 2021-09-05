pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

//todo подумать, хватит ли везде тут uint16, нужен ли вообще uint16 использовать safe
contract Traits is Initializable {

    struct Trait {
        string name;
        string[] keys;
        uint16[] rarities;
    }

    Trait[] traits;

    function __Traits_init_unchained(Trait[] memory _traits) internal initializer {
        for (uint16 i = 0; i < _traits.length; i++) {
            Trait memory _trait = _traits[i];
            traits.push(_trait);

            uint16 total = 0;
            require(_trait.keys.length == _trait.rarities.length, "keys and rarities length not equal");
            for (uint16 j = 0; j < _trait.rarities.length; j++) {
                total += _trait.rarities[j];
            }
            require(total == 10000, "sum or rarities not equal 10000");
        }
    }

    function generateRandomTraits() internal view  returns (uint16[] memory) {
        uint16[] memory result = new uint16[](traits.length);
        for (uint16 i = 0; i < traits.length; i++) {
            Trait memory trait = traits[i];
            result[i] = getTraitValue(trait, random(i) % 10000);
        }

        return result;
    }

    function getTraitValue(Trait memory trait, uint rnd) internal pure returns (uint16) {
        uint total = 0;
        for (uint16 i = 0; i < trait.rarities.length; i++) {
            total += trait.rarities[i];
            if (rnd < total) {
                return i;
            }
        }
        revert("never");
    }

    function random(uint seed) internal view returns (uint) {
        //todo think about vulnerabilities
        return uint(keccak256(abi.encodePacked(seed, block.timestamp, block.number, msg.sender)));
    }
}
