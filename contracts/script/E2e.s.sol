// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CrossDelegation, CrowOrderWithSig} from "../src/CrossDelegation.sol";
import {Settler} from "../src/Settler.sol";
import {OnchainCrossChainOrder} from "../src/Order.sol";
import {CrowOrderData, XCall, CROW_ORDER_DATA_TYPE_HASH} from "../src/ERC7683Crow.sol";
import {Token} from "../src/Token.sol";

contract E2eScript is Script {
    CrossDelegation public crossDelegation;
    Settler public settler;
    Token public token;

    //randomly generated private key whose public key is authorized in account
    uint256 privateKey = vm.envUint("AUTH_PRIVATE_KEY");

    function setUp() public {
        crossDelegation = CrossDelegation(payable(0x11dc744F9b69b87a1eb19C3900e0fF85B6853990));
        settler = Settler(payable(0xAF4dC4a50B141b8e39334101C726D40BDCf76834));
        token = Token(payable(0xE2632Ce7bCE542227FB5Af075FDA80155a84c964));
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        CrowOrderData memory crowOrderData =
            CrowOrderData({token: address(token), amount: 1 ether, dstChainId: 911867, xCalls: new XCall[](0)});
        bytes32 orderId = keccak256(abi.encode(crowOrderData, block.chainid));

        (bytes32 r, bytes32 s) = vm.signP256(privateKey, orderId);
        bytes memory signature = abi.encode(r, s);

        CrowOrderWithSig memory orderWithSig = CrowOrderWithSig({orderData: crowOrderData, signature: signature});
        bytes memory originData = abi.encode(orderWithSig);

        OnchainCrossChainOrder memory order = OnchainCrossChainOrder({
            fillDeadline: uint32(block.timestamp + 1 days),
            orderDataType: CROW_ORDER_DATA_TYPE_HASH,
            orderData: abi.encode(crowOrderData, new bytes(0))
        });

        token.approve(address(settler), 1 ether);
        settler.open(order);

        crossDelegation.fill(orderId, originData, new bytes(0));

        vm.stopBroadcast();
    }
}
