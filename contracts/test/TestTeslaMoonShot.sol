// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "../TeslaMoonShot.sol";

contract TestTeslaMoonShot is TeslaMoonShot {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) TeslaMoonShot(name_, symbol_, decimals_) {}

    function getTokenPrice(uint amount) public view returns(uint)
    {
        IUniswapV2Pair pair = IUniswapV2Pair(uniswapV2Pair);
        //        IERC20 token1 = IERC20(pair.token1);
        (uint Res0, uint Res1,) = pair.getReserves();

        // decimals
        uint res0 = Res0*(10**decimals());
        return((amount*res0)/Res1); // return amount of token0 needed to buy token1
    }

    function convertTMS(uint tmsAmount) public payable {
        uint deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        uniswapV2Router.swapETHForExactTokens{ value: msg.value }(tmsAmount, getPathForETHtoTMS(), address(this), deadline);

        // refund leftover ETH to user
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    function getEstimatedETHforTMS(uint tmsAmount) public view returns (uint[] memory) {
        return uniswapV2Router.getAmountsIn(tmsAmount, getPathForETHtoTMS());
    }

    function getPathForETHtoTMS() public view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = uniswapV2Router.WETH();
        path[1] = address(this);

        return path;
    }


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
