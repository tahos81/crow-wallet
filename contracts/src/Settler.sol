// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import {IOriginSettler} from "./interface/IOriginSettler.sol";
import {
    GaslessCrossChainOrder,
    OnchainCrossChainOrder,
    ResolvedCrossChainOrder,
    Output,
    FillInstruction
} from "./Order.sol";
import {CrowOrderData, CROW_ORDER_DATA_TYPE_HASH} from "./ERC7683Crow.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPermit2} from "./interface/IPermit2.sol";
import {ERC7683Permit2Lib} from "./ERC7683Crow.sol";
import {CrowOrderWithSig} from "./CrossDelegation.sol";

contract Settler is IOriginSettler {
    using SafeERC20 for IERC20;

    IPermit2 public immutable PERMIT2;

    constructor(address _permit2) {
        PERMIT2 = IPermit2(_permit2);
    }

    function openFor(GaslessCrossChainOrder calldata order, bytes calldata signature, bytes calldata originFillerData)
        external
        override
    {
        (ResolvedCrossChainOrder memory resolvedOrder, CrowOrderData memory crowOrderData) =
            _resolveFor(order, originFillerData);

        _processPermit2Order(order, crowOrderData, signature);

        //use funds

        emit Open(keccak256(resolvedOrder.fillInstructions[0].originData), resolvedOrder);
    }

    function open(OnchainCrossChainOrder calldata order) external override {
        (ResolvedCrossChainOrder memory resolvedOrder, CrowOrderData memory crowOrderData) = _resolve(order);

        IERC20(crowOrderData.token).safeTransferFrom(msg.sender, address(this), crowOrderData.amount);

        //use funds

        emit Open(keccak256(resolvedOrder.fillInstructions[0].originData), resolvedOrder);
    }

    function resolveFor(GaslessCrossChainOrder calldata order, bytes calldata originFillerData)
        external
        view
        override
        returns (ResolvedCrossChainOrder memory resolvedOrder)
    {
        (resolvedOrder,) = _resolveFor(order, originFillerData);
    }

    function resolve(OnchainCrossChainOrder calldata order)
        external
        view
        override
        returns (ResolvedCrossChainOrder memory resolvedOrder)
    {
        (resolvedOrder,) = _resolve(order);
    }

    function _resolve(OnchainCrossChainOrder calldata order)
        internal
        view
        returns (ResolvedCrossChainOrder memory, CrowOrderData memory)
    {
        require(order.orderDataType == CROW_ORDER_DATA_TYPE_HASH, "invalid order data type");

        (CrowOrderData memory crowOrderData, bytes memory signature) =
            abi.decode(order.orderData, (CrowOrderData, bytes));

        Output[] memory maxSpent = new Output[](1);
        maxSpent[0] = Output({
            token: _toBytes32(crowOrderData.token),
            amount: crowOrderData.amount,
            recipient: _toBytes32(msg.sender),
            chainId: crowOrderData.dstChainId
        });

        // We assume that filler takes repayment on the origin chain in which case the filler output
        // will always be equal to the input amount. If the filler requests repayment somewhere else then
        // the filler output will be equal to the input amount less a fee based on the chain they request
        // repayment on.
        Output[] memory minReceived = new Output[](1);
        minReceived[0] = Output({
            token: _toBytes32(crowOrderData.token),
            amount: crowOrderData.amount,
            recipient: _toBytes32(address(0)),
            chainId: block.chainid
        });

        CrowOrderWithSig memory crowOrderWithSig = CrowOrderWithSig({orderData: crowOrderData, signature: signature});

        FillInstruction[] memory fillInstructions = new FillInstruction[](1);
        fillInstructions[0] = FillInstruction({
            destinationChainId: crowOrderData.dstChainId,
            destinationSettler: _toBytes32(msg.sender),
            originData: abi.encode(crowOrderWithSig)
        });

        ResolvedCrossChainOrder memory resolvedOrder = ResolvedCrossChainOrder({
            user: msg.sender,
            originChainId: block.chainid,
            openDeadline: type(uint32).max,
            fillDeadline: order.fillDeadline,
            minReceived: minReceived,
            maxSpent: maxSpent,
            fillInstructions: fillInstructions,
            orderId: keccak256(abi.encode(crowOrderData, crowOrderData.dstChainId))
        });

        return (resolvedOrder, crowOrderData);
    }

    function _resolveFor(GaslessCrossChainOrder calldata order, bytes calldata /* originFillerData */ )
        internal
        view
        returns (ResolvedCrossChainOrder memory, CrowOrderData memory)
    {
        require(order.originSettler == address(this), "invalid settler");
        require(order.originChainId == block.chainid, "invalid chainId");
        require(order.orderDataType == CROW_ORDER_DATA_TYPE_HASH, "invalid orderDataType");

        (CrowOrderData memory crowOrderData, bytes memory signature) =
            abi.decode(order.orderData, (CrowOrderData, bytes));

        Output[] memory maxSpent = new Output[](1);
        maxSpent[0] = Output({
            token: _toBytes32(crowOrderData.token),
            amount: crowOrderData.amount,
            recipient: _toBytes32(order.user),
            chainId: crowOrderData.dstChainId
        });

        Output[] memory minReceived = new Output[](1);
        minReceived[0] = Output({
            token: _toBytes32(crowOrderData.token),
            amount: crowOrderData.amount,
            recipient: _toBytes32(order.user),
            chainId: block.chainid
        });

        CrowOrderWithSig memory crowOrderWithSig = CrowOrderWithSig({orderData: crowOrderData, signature: signature});

        FillInstruction[] memory fillInstructions = new FillInstruction[](1);
        fillInstructions[0] = FillInstruction({
            destinationChainId: crowOrderData.dstChainId,
            destinationSettler: _toBytes32(msg.sender),
            originData: abi.encode(crowOrderWithSig)
        });

        ResolvedCrossChainOrder memory resolvedOrder = ResolvedCrossChainOrder({
            user: order.user,
            originChainId: order.originChainId,
            openDeadline: order.openDeadline,
            fillDeadline: order.fillDeadline,
            minReceived: minReceived,
            maxSpent: maxSpent,
            fillInstructions: fillInstructions,
            orderId: keccak256(abi.encode(crowOrderData, crowOrderData.dstChainId))
        });

        return (resolvedOrder, crowOrderData);
    }

    function _processPermit2Order(
        GaslessCrossChainOrder memory order,
        CrowOrderData memory crowOrderData,
        bytes memory signature
    ) internal {
        IPermit2.PermitTransferFrom memory permit = IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({token: crowOrderData.token, amount: crowOrderData.amount}),
            nonce: order.nonce,
            deadline: order.openDeadline
        });

        IPermit2.SignatureTransferDetails memory signatureTransferDetails =
            IPermit2.SignatureTransferDetails({to: address(this), requestedAmount: crowOrderData.amount});

        // Pull user funds.
        PERMIT2.permitWitnessTransferFrom(
            permit,
            signatureTransferDetails,
            order.user,
            ERC7683Permit2Lib.hashOrder(order, ERC7683Permit2Lib.hashOrderData(crowOrderData)), // witness data hash
            ERC7683Permit2Lib.PERMIT2_ORDER_TYPE, // witness data type string
            signature
        );
    }

    function _toBytes32(address input) private pure returns (bytes32) {
        return bytes32(uint256(uint160(input)));
    }
}
