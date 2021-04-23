// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./ILottery.sol";
import "../access/Ownable.sol";


contract Lottery is ILottery, Ownable {
    address[] private winners;

    address[] internal eligibleForLottery;

    address private immutable TokenContract;
    IRandomize private randomizeContract;

    uint256 maxPrizePool;

    modifier onlyToken {
        require(
            msg.sender == TokenContract,
            "Only Token contract can call this function"
        );
        _;
    }

    constructor(address TokenContract_) {
        TokenContract = TokenContract_;
        maxPrizePool = 500 * 1E18;
        randomizeContract = new Randomize();
    }

    function setNewRandomizeContract(address _randomizeContract)
    external
    override
    onlyOwner
    {
        address oldRandomizeAddress;
        randomizeContract = IRandomize(_randomizeContract);
        emit UpdateRandomizeContract(
            oldRandomizeAddress,
            address(_randomizeContract)
        );
    }

    function setMaxPrizePool(uint256 _maxPrizePool)
    external
    override
    onlyOwner
    {
        uint256 _oldMaxPrizePool = maxPrizePool;
        maxPrizePool = _maxPrizePool;
        emit UpdatedMaxPrizePool(_oldMaxPrizePool, _maxPrizePool);
    }

    function lottery() external override onlyToken {
        if (getContractBalance() >= maxPrizePool) {
            uint256 length = eligibleForLottery.length;
            uint256 index = randomizeContract.randomize(length);
            if (eligibleForLottery[index] != address(0)) {
                IERC20(TokenContract).transfer(
                    eligibleForLottery[index],
                    maxPrizePool
                );
                winners.push(eligibleForLottery[index]);
                emit Lottery(
                    eligibleForLottery[index],
                    maxPrizePool,
                    block.timestamp
                );
            }
        }
    }

    function addToLottery(address account) external override onlyToken {
        if (!isEligible(account)) {
            eligibleForLottery.push(account);
        }
        emit AddedToLottery(account);
    }

    function removeFromLottery(address account) external override onlyToken {
        if (isEligible(account)) {
            uint256 index = _getAccountIndex(account);
            _removeFromEligibility(index);
        }
        emit RemovedFromLottery(account);
    }

    function getWinners() external view override returns (address[] memory) {
        return winners;
    }

    function getContractBalance() public view override returns (uint256) {
        return IERC20(TokenContract).balanceOf(address(this));
    }

    function isEligible(address account) public view override returns (bool) {
        uint256 length = eligibleForLottery.length;
        for (uint256 i = 0; i < length; i++) {
            if (eligibleForLottery[i] == account) {
                return true;
            }
        }
        return false;
    }

    function _removeFromEligibility(uint256 index) internal {
        uint256 length = eligibleForLottery.length;

        for (uint256 i = index; i < length - 1; i++) {
            eligibleForLottery[i] = eligibleForLottery[i + 1];
        }
        eligibleForLottery.pop();
    }

    function _getAccountIndex(address account) internal view returns (uint256) {
        uint256 length = eligibleForLottery.length;
        for (uint256 i = 0; i < length; i++) {
            if (eligibleForLottery[i] == account) {
                return i;
            }
        }
        revert("Lottery: Account not present in the list");
    }
}