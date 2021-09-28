// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

import "./interfaces/IERC721GenMint.sol";
import "./royalties/RoyaltiesV2GenImpl.sol";
import "./tokens/ERC721GenDefaultApproval.sol";
import "./tokens/ERC721GenOperatorRole.sol";
import "./traits/TraitsManager.sol";
import "./utils/AddAddrToURI.sol";

contract ERC721Gen is OwnableUpgradeable, ERC721GenDefaultApproval, RoyaltiesV2GenImpl, TraitsManager, AddAddrToURI, ERC721GenOperatorRole, IERC721GenMint {
    using SafeMathUpgradeable for uint;

    event GenArtTotal(uint total);
    event GenArtMint(uint tokenId);

    //max amount of tokens in existance
    uint public total;

    //max amount of tokens to be minted in one transaction
    uint public maxValue;

    function __ERC721Gen_init(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        address _transferProxy,
        address _operatorProxy,
        LibPart.Part[] memory _royalties,
        Trait[] memory _traits,
        uint _total,
        uint _maxValue
    ) external initializer {
        _setBaseURI(addTokenAddrToBaseURI(_baseURI, address(this)));
        __RoyaltiesV2Upgradeable_init_unchained();
        __RoyaltiesV2GenImpl_init_unchained(_royalties);
        __Context_init_unchained();
        __ERC165_init_unchained();
        __Ownable_init_unchained();
        __ERC721_init_unchained(_name, _symbol);
        __TraitsManager_init_unchained(_traits);
        __ERC721GenDefaultApproval_init_unchained(_transferProxy);
        __ERC721GenOperatorRole_init_unchained(_operatorProxy);
        __ERC721Gen_init_unchained(_total, _maxValue);
    }

    function __ERC721Gen_init_unchained(uint _total, uint _maxValue) internal initializer {
        maxValue = _maxValue;
        total = _total;
        emit GenArtTotal(total);
    }

    //mint "value" amount of tokens and transfer them to "to" address
    function mint(address artist, address to, uint value) onlyOperator() override public {
        require(value > 0 && value <= maxValue, "incorrect value of tokens to mint");
        require(artist == owner(), "artist is not an owner");
        require(super.totalSupply().add(value) <= total, "all minted");

        for (uint i = 0; i < value; i ++) {
            mintSingleToken(to, i);
        }
    }

    //mint one token
    function mintSingleToken(address to, uint seed) internal {
        uint tokenId = random(seed, super.totalSupply(), to);
        _mint(to, tokenId);
        emit GenArtMint(tokenId);
    }

    function tokenURI(uint256) public view virtual override returns (string memory) {
        return string(abi.encodePacked(baseURI(), "{id}"));
    }

    function getTokenTraits(uint tokenId) public view returns (uint[] memory) {
        uint[] memory result = new uint[](traits.length);
        for (uint i = 0; i < traits.length; i++) {
            result[i] = getTraitValue(traits[i], getRandom(tokenId, i));
        }
        return result;
    }

    //close totalSupply() to external user
    function totalSupply() public pure override returns (uint256) {
        return 0;
    }

    uint256[50] private __gap;
}
