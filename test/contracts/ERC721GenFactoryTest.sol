// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma abicoder v2;

import "../../contracts/ERC721GenFactory.sol";

contract ERC721GenFactoryTest is ERC721GenFactory {
    constructor(
        IBeacon _beacon,
        address _transferProxy,
        address _operatorProxy,
        string memory _baseURI
    ) ERC721GenFactory(_beacon, _transferProxy, _operatorProxy, _baseURI) {}
}
