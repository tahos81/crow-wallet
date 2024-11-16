// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {IPermit2} from "./interface/IPermit2.sol";
import {GaslessCrossChainOrder} from "./Order.sol";

struct XCall {
    address target;
    bytes callData;
    uint256 value;
}

struct CrowOrderData {
    address token;
    uint256 amount;
    uint64 dstChainId;
    XCall[] xCalls;
}

bytes constant XCALL_DATA_TYPE = abi.encodePacked("XCall(address target,bytes callData,uint256 value)");
bytes32 constant XCALL_DATA_TYPE_HASH = keccak256(XCALL_DATA_TYPE);

bytes constant CROW_ORDER_DATA_TYPE = abi.encodePacked(
    "CrowOrderData(address token,uint256 amount,uint64 dstChainId,XCall[] xCalls)",
    "Call(address target,bytes callData,uint256 value)"
);
bytes32 constant CROW_ORDER_DATA_TYPE_HASH = keccak256(CROW_ORDER_DATA_TYPE);

library ERC7683Permit2Lib {
    bytes internal constant CROSS_CHAIN_ORDER_TYPE = abi.encodePacked(
        "GaslessCrossChainOrder(",
        "address originSettler,",
        "address user,",
        "uint256 nonce,",
        "uint256 originChainId,",
        "uint32 openDeadline,",
        "uint32 fillDeadline,",
        "bytes32 orderDataType,",
        "XCallsOrderData orderData)"
    );

    bytes internal constant CROSS_CHAIN_ORDER_EIP712_TYPE =
        abi.encodePacked(CROSS_CHAIN_ORDER_TYPE, CROW_ORDER_DATA_TYPE);
    bytes32 internal constant CROSS_CHAIN_ORDER_TYPE_HASH = keccak256(CROSS_CHAIN_ORDER_EIP712_TYPE);

    string private constant TOKEN_PERMISSIONS_TYPE = "TokenPermissions(address token,uint256 amount)";
    string internal constant PERMIT2_ORDER_TYPE = string(
        abi.encodePacked(
            "CrossChainOrder witness)", CROW_ORDER_DATA_TYPE, CROSS_CHAIN_ORDER_TYPE, TOKEN_PERMISSIONS_TYPE
        )
    );

    // Hashes an order to get an order hash. Needed for permit2.
    function hashOrder(GaslessCrossChainOrder memory order, bytes32 orderDataHash) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                CROSS_CHAIN_ORDER_TYPE_HASH,
                order.originSettler,
                order.user,
                order.nonce,
                order.originChainId,
                order.openDeadline,
                order.fillDeadline,
                orderDataHash
            )
        );
    }

    function hashOrderData(CrowOrderData memory orderData) internal pure returns (bytes32) {
        bytes32[] memory xCallHashes = new bytes32[](orderData.xCalls.length);
        for (uint256 i = 0; i < orderData.xCalls.length; i++) {
            xCallHashes[i] = keccak256(
                abi.encode(
                    XCALL_DATA_TYPE_HASH,
                    orderData.xCalls[i].target,
                    keccak256(orderData.xCalls[i].callData),
                    orderData.xCalls[i].value
                )
            );
        }
        return keccak256(
            abi.encode(CROW_ORDER_DATA_TYPE_HASH, orderData.token, orderData.amount, orderData.dstChainId, xCallHashes)
        );
    }
}
