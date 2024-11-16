// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {IDestinationSettler} from "./interface/IDestinationSettler.sol";
import {CrowOrderData, XCall} from "./ERC7683Crow.sol";
import {Secp256r1} from "./libraries/Secp256r1.sol";

struct CrowOrderWithSig {
    CrowOrderData orderData;
    bytes signature;
}

contract CrossDelegation is IDestinationSettler {
    /// @notice The x coordinate of the authorized public key
    uint256 authorizedPublicKeyX;
    /// @notice The y coordinate of the authorized public key
    uint256 authorizedPublicKeyY;

    /// @notice Authorizes provided public key to transact on behalf of this account. Only callable by EOA itself.
    function authorize(uint256 publicKeyX, uint256 publicKeyY) public {
        require(msg.sender == address(this));

        authorizedPublicKeyX = publicKeyX;
        authorizedPublicKeyY = publicKeyY;
    }

    function fill(bytes32 orderId, bytes calldata originData, bytes calldata /* fillerData */ ) external override {
        require(keccak256(abi.encode(originData, block.chainid)) == orderId, "invalid order id");

        // Ensure that the call is not malformed. If the call is malformed, abi.decode will fail.
        CrowOrderWithSig memory orderWithSig = abi.decode(originData, (CrowOrderWithSig));

        (bytes32 r, bytes32 s) = abi.decode(orderWithSig.signature, (bytes32, bytes32));

        require(Secp256r1.verify(orderId, r, s, authorizedPublicKeyX, authorizedPublicKeyY), "Invalid signature");

        _execute(orderWithSig.orderData);
    }

    function _execute(CrowOrderData memory orderData) internal {
        for (uint256 i = 0; i < orderData.xCalls.length; i++) {
            XCall memory xCall = orderData.xCalls[i];
            (bool success,) = xCall.target.call{value: xCall.value}(xCall.callData);
            require(success, "xCall failed");
        }
    }

    fallback() external payable {}
    receive() external payable {}
}
