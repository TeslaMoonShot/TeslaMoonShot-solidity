// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./token/Safe.sol";

contract TeslaMoonShot is Safe {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    )
        Safe(
            name_,
            symbol_,
            decimals_
        ) { }
}
