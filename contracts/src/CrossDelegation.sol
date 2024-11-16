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

    /// @notice Internal nonce used for replay protection, must be tracked and included into prehashed message.
    uint256 public nonce;

    /// @notice Authorizes provided public key to transact on behalf of this account. Only callable by EOA itself.
    function authorize(uint256 publicKeyX, uint256 publicKeyY) public {
        require(msg.sender == address(this));

        authorizedPublicKeyX = publicKeyX;
        authorizedPublicKeyY = publicKeyY;
    }

    function fill(bytes32 orderId, bytes calldata originData, bytes calldata /* fillerData */ ) external override {
        // Ensure that the call is not malformed. If the call is malformed, abi.decode will fail.
        CrowOrderWithSig memory orderWithSig = abi.decode(originData, (CrowOrderWithSig));

        require(keccak256(abi.encode(orderWithSig.orderData, block.chainid)) == orderId, "invalid order id");

        (bytes32 r, bytes32 s) = abi.decode(orderWithSig.signature, (bytes32, bytes32));

        require(Secp256r1.verify(orderId, r, s, authorizedPublicKeyX, authorizedPublicKeyY), "Invalid signature");

        _execute(orderWithSig.orderData);
    }

    function transact(address to, bytes memory data, uint256 value, bytes32 r, bytes32 s) public {
        bytes32 digest = keccak256(abi.encode(nonce++, to, data, value));
        require(Secp256r1.verify(digest, r, s, authorizedPublicKeyX, authorizedPublicKeyY), "Invalid signature");

        (bool success,) = to.call{value: value}(data);
        require(success);
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
