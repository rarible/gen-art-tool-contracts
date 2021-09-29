// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "../../contracts/utils/AddAddrToURI.sol";

contract AddAddrToURITest is AddAddrToURI {
    function toAsciiStringTest(address x) public pure returns (string memory) {
        return toAsciiString(x);
    }
}
