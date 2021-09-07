// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma abicoder v2;

import "../../contracts/royalties/RoyaltiesV2GenImpl.sol";

contract RoyaltiesV2GenImplTest is RoyaltiesV2GenImpl {

    function __RoyaltiesV2GenImplTest_init(LibPart.Part[] memory _royalties) external initializer {
        __RoyaltiesV2Upgradeable_init_unchained();
        __RoyaltiesV2GenImpl_init_unchained(_royalties);
    }

}