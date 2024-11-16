// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract InvestPool {
    using SafeERC20 for IERC20;

    mapping(address => uint256) public balances;

    function invest(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        balances[token] += amount;
    }

    function withdraw(address token, uint256 amount) external {
        require(balances[token] >= amount, "Insufficient balance");
        IERC20(token).safeTransfer(msg.sender, amount);
        balances[token] -= amount;
    }
}
