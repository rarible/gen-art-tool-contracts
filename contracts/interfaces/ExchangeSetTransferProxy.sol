// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

//interface to set transferProxy (that is going to mint tokens) in exchangeV2
abstract contract ExchangeSetTransferProxy{
    mapping (bytes4 => address) proxies;

    event ProxyChange(bytes4 indexed assetType, address proxy);

    function setTransferProxy(bytes4 assetType, address proxy) external {
        proxies[assetType] = proxy;
        emit ProxyChange(assetType, proxy);
    }

}
