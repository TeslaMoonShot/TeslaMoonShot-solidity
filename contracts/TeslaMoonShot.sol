// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./token/ERC20.sol";
import "./access/Ownable.sol";

contract TeslaMoonShot is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_, decimals_) {
        _mint(msg.sender, 100_000_000_000);
    }
}
