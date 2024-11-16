// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console2} from "forge-std/Test.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {ExperimentDelegation} from "../src/ExperimentDelegation.sol";
import {P256} from "../src/utils/P256.sol";
import {ECDSA} from "../src/utils/ECDSA.sol";

contract Callee {
    error UnexpectedSender(address expected, address actual);

    mapping(address => uint256) public counter;
    mapping(address => uint256) public values;

    function increment() public payable {
        counter[msg.sender] += 1;
        values[msg.sender] += msg.value;
    }

    function expectSender(address expected) public payable {
        if (msg.sender != expected) {
            revert UnexpectedSender(expected, msg.sender);
        }
    }
}

contract ExperimentDelegationTest is Test {
    ExperimentDelegation public delegation;
    uint256 public p256PrivateKey;
    Callee public callee;

    function setUp() public {
        callee = new Callee();
        delegation = new ExperimentDelegation();
        p256PrivateKey = 100366595829038452957523597440756290436854445761208339940577349703440345778405;
        vm.deal(address(delegation), 1.5 ether);
    }

    function test_authorize() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);
        ECDSA.PublicKey memory publicKey = ECDSA.PublicKey(x, y);

        vm.expectRevert();
        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.authorize(publicKey, 0);
        vm.pauseGasMetering();

        (
            bool authorized,
            uint256 expiry,
            ECDSA.PublicKey memory authorizedPublicKey
        ) = delegation.keys(0);
        assertEq(authorized, true);
        assertEq(authorizedPublicKey.x, x);
        assertEq(authorizedPublicKey.y, y);
        assertEq(expiry, 0);
    }

    function test_authorize_revertInvalidAuthority() public {
        vm.pauseGasMetering();
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);
        ECDSA.PublicKey memory publicKey = ECDSA.PublicKey(x, y);

        vm.expectRevert();
        delegation.keys(0);

        vm.resumeGasMetering();
        vm.expectRevert(ExperimentDelegation.InvalidAuthority.selector);
        delegation.authorize(publicKey, 0);
    }

    function test_revoke() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);
        ECDSA.PublicKey memory publicKey = ECDSA.PublicKey(x, y);

        vm.prank(address(delegation));
        delegation.authorize(publicKey, 0);

        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.revoke(0);
        vm.pauseGasMetering();

        (
            bool authorized,
            uint256 expiry,
            ECDSA.PublicKey memory authorizedPublicKey
        ) = delegation.keys(0);
        assertEq(authorized, false);
    }

    function test_execute() public {
        vm.pauseGasMetering();

        assertEq(address(delegation).balance, 1.5 ether);
        assertEq(address(callee).balance, 0 ether);

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(
            uint8(0),
            address(callee),
            uint256(0.5 ether),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0.5 ether),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0.5 ether),
            data.length,
            data
        );

        bytes32 hash = keccak256(
            abi.encodePacked(delegation.nonce(), calls)
        );
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        vm.prank(address(delegation));
        delegation.authorize(
            ECDSA.PublicKey(x, y),
            0
        );

        vm.resumeGasMetering();
        delegation.execute(
            calls,
            ECDSA.Signature(uint256(r), uint256(s)),
            0,
            false
        );
        vm.pauseGasMetering();

        assertEq(callee.counter(address(delegation)), 3);
        assertEq(callee.values(address(delegation)), 1.5 ether);
        assertEq(address(delegation).balance, 0 ether);
        assertEq(address(callee).balance, 1.5 ether);
    }

    function test_execute_revertRevoke() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );

        bytes32 hash = keccak256(
            abi.encodePacked(delegation.nonce(), calls)
        );
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        vm.prank(address(delegation));
        delegation.authorize(
            ECDSA.PublicKey(x, y),
            0
        );

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.revoke(0);
        vm.pauseGasMetering();

        vm.expectRevert(ExperimentDelegation.KeyNotAuthorized.selector);
        delegation.execute(
            calls,
            ECDSA.Signature(uint256(r), uint256(s)),
            0,
            false
        );
    }

    function test_execute_revertExpired() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );

        bytes32 hash = keccak256(
            abi.encodePacked(delegation.nonce(), calls)
        );
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        vm.prank(address(delegation));
        delegation.authorize(
            ECDSA.PublicKey(x, y),
            block.timestamp
        );

        vm.warp(block.timestamp + 1);

        vm.expectRevert(ExperimentDelegation.KeyExpired.selector);
        delegation.execute(
            calls,
            ECDSA.Signature(uint256(r), uint256(s)),
            0,
            false
        );
    }

    function test_revertReplay() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );
        calls = abi.encodePacked(
            calls,
            uint8(0),
            address(callee),
            uint256(0),
            data.length,
            data
        );

        bytes32 hash = keccak256(
            abi.encodePacked(delegation.nonce(), calls)
        );
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        vm.prank(address(delegation));
        delegation.authorize(
            ECDSA.PublicKey(x, y),
            0
        );

        vm.resumeGasMetering();
        delegation.execute(
            calls,
            ECDSA.Signature(uint256(r), uint256(s)),
            0,
            false
        );
        vm.pauseGasMetering();

        vm.expectRevert(ExperimentDelegation.InvalidSignature.selector);
        delegation.execute(
            calls,
            ECDSA.Signature(uint256(r), uint256(s)),
            0,
            false
        );
    }
}
