// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "../TeslaMoonShot.sol";

contract TestTeslaMoonShot is TeslaMoonShot {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) TeslaMoonShot(name_, symbol_, decimals_) {}

    function getTaxFee(uint256 _amount) external view returns (uint256) {
        return calculateTaxFee(_amount);
    }

    function getBurnFee(uint256 _amount) external view returns (uint256) {
        return calculateBurnFee(_amount);
    }

    function getLiquidityFee(uint256 _amount) external view returns (uint256) {
        return calculateLiquidityFee(_amount);
    }

    function getRate() external view returns (uint256) {
        return _getRate();
    }

    function getCurrentSupply() external view returns (uint256, uint256) {
        return _getCurrentSupply();
    }

    function getValues(uint256 amount)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return _getValues(amount);
    }

    function getTValues(uint256 tAmount)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return _getTValues(tAmount);
    }

    function getRTotal() external view returns(uint) {
        return _rTotal;
    }
}
