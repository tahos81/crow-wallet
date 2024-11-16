// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {IDestinationSettler} from "./interface/IDestinationSettler.sol";

contract CrossDelegation is IDestinationSettler {
    function fill(bytes32 orderId, bytes calldata originData, bytes calldata fillerData) external override {}
}
