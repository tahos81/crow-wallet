export const ExperimentDelegation = {
  abi: [
    { type: "fallback", stateMutability: "payable" },
    { type: "receive", stateMutability: "payable" },
    {
      type: "function",
      name: "authorize",
      inputs: [
        {
          name: "publicKey",
          type: "tuple",
          internalType: "struct ECDSA.PublicKey",
          components: [
            { name: "x", type: "uint256", internalType: "uint256" },
            { name: "y", type: "uint256", internalType: "uint256" },
          ],
        },
        { name: "expiry", type: "uint256", internalType: "uint256" },
        {
          name: "signature",
          type: "tuple",
          internalType: "struct ECDSA.RecoveredSignature",
          components: [
            { name: "r", type: "uint256", internalType: "uint256" },
            { name: "s", type: "uint256", internalType: "uint256" },
            { name: "yParity", type: "uint8", internalType: "uint8" },
          ],
        },
      ],
      outputs: [{ name: "keyIndex", type: "uint32", internalType: "uint32" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "authorize",
      inputs: [
        {
          name: "publicKey",
          type: "tuple",
          internalType: "struct ECDSA.PublicKey",
          components: [
            { name: "x", type: "uint256", internalType: "uint256" },
            { name: "y", type: "uint256", internalType: "uint256" },
          ],
        },
        { name: "expiry", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "keyIndex", type: "uint32", internalType: "uint32" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "execute",
      inputs: [{ name: "calls", type: "bytes", internalType: "bytes" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "execute",
      inputs: [
        { name: "calls", type: "bytes", internalType: "bytes" },
        {
          name: "signature",
          type: "tuple",
          internalType: "struct ECDSA.Signature",
          components: [
            { name: "r", type: "uint256", internalType: "uint256" },
            { name: "s", type: "uint256", internalType: "uint256" },
          ],
        },
        {
          name: "metadata",
          type: "tuple",
          internalType: "struct WebAuthnP256.Metadata",
          components: [
            { name: "authenticatorData", type: "bytes", internalType: "bytes" },
            { name: "clientDataJSON", type: "string", internalType: "string" },
            { name: "challengeIndex", type: "uint16", internalType: "uint16" },
            { name: "typeIndex", type: "uint16", internalType: "uint16" },
            {
              name: "userVerificationRequired",
              type: "bool",
              internalType: "bool",
            },
          ],
        },
        { name: "keyIndex", type: "uint32", internalType: "uint32" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "execute",
      inputs: [
        { name: "calls", type: "bytes", internalType: "bytes" },
        {
          name: "signature",
          type: "tuple",
          internalType: "struct ECDSA.Signature",
          components: [
            { name: "r", type: "uint256", internalType: "uint256" },
            { name: "s", type: "uint256", internalType: "uint256" },
          ],
        },
        { name: "keyIndex", type: "uint32", internalType: "uint32" },
        { name: "prehash", type: "bool", internalType: "bool" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "keys",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [
        { name: "authorized", type: "bool", internalType: "bool" },
        { name: "expiry", type: "uint256", internalType: "uint256" },
        {
          name: "publicKey",
          type: "tuple",
          internalType: "struct ECDSA.PublicKey",
          components: [
            { name: "x", type: "uint256", internalType: "uint256" },
            { name: "y", type: "uint256", internalType: "uint256" },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "multiSend",
      inputs: [{ name: "transactions", type: "bytes", internalType: "bytes" }],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "nonce",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "revoke",
      inputs: [{ name: "keyIndex", type: "uint32", internalType: "uint32" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "revoke",
      inputs: [
        { name: "keyIndex", type: "uint32", internalType: "uint32" },
        {
          name: "signature",
          type: "tuple",
          internalType: "struct ECDSA.RecoveredSignature",
          components: [
            { name: "r", type: "uint256", internalType: "uint256" },
            { name: "s", type: "uint256", internalType: "uint256" },
            { name: "yParity", type: "uint8", internalType: "uint8" },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    { type: "error", name: "InvalidAuthority", inputs: [] },
    { type: "error", name: "InvalidSignature", inputs: [] },
    { type: "error", name: "KeyExpired", inputs: [] },
    { type: "error", name: "KeyNotAuthorized", inputs: [] },
  ],
  address: "0x62f8846e2c342Db3bFeBaf520c13D05f2FD1f177",
} as const;

export const ExperimentERC20 = {
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_permit2",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "PERMIT2",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IPermit2",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "open",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct OnchainCrossChainOrder",
          components: [
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "openFor",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct GaslessCrossChainOrder",
          components: [
            {
              name: "originSettler",
              type: "address",
              internalType: "address",
            },
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "nonce",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
        {
          name: "signature",
          type: "bytes",
          internalType: "bytes",
        },
        {
          name: "originFillerData",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "resolve",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct OnchainCrossChainOrder",
          components: [
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "resolvedOrder",
          type: "tuple",
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "resolveFor",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct GaslessCrossChainOrder",
          components: [
            {
              name: "originSettler",
              type: "address",
              internalType: "address",
            },
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "nonce",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
        {
          name: "originFillerData",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [
        {
          name: "resolvedOrder",
          type: "tuple",
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "Open",
      inputs: [
        {
          name: "orderId",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "resolvedOrder",
          type: "tuple",
          indexed: false,
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "SafeERC20FailedOperation",
      inputs: [
        {
          name: "token",
          type: "address",
          internalType: "address",
        },
      ],
    },
  ],
  address: "0x238c8CD93ee9F8c7Edf395548eF60c0d2e46665E",
} as const;

export const DEFAULT_ERC20 = {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  address: "0xc6Ab1437507B4156b4DbFbe061b369f0973Be8F4",
} as const;

export const SETTLER = {
  address: "0xdb1Bc2A7C2e6CBc112138E098132761e301b510c",
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_permit2",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "PERMIT2",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IPermit2",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "open",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct OnchainCrossChainOrder",
          components: [
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "openFor",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct GaslessCrossChainOrder",
          components: [
            {
              name: "originSettler",
              type: "address",
              internalType: "address",
            },
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "nonce",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
        {
          name: "signature",
          type: "bytes",
          internalType: "bytes",
        },
        {
          name: "originFillerData",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "resolve",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct OnchainCrossChainOrder",
          components: [
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      outputs: [
        {
          name: "resolvedOrder",
          type: "tuple",
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "resolveFor",
      inputs: [
        {
          name: "order",
          type: "tuple",
          internalType: "struct GaslessCrossChainOrder",
          components: [
            {
              name: "originSettler",
              type: "address",
              internalType: "address",
            },
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "nonce",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderDataType",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "orderData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
        {
          name: "originFillerData",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [
        {
          name: "resolvedOrder",
          type: "tuple",
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "Open",
      inputs: [
        {
          name: "orderId",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "resolvedOrder",
          type: "tuple",
          indexed: false,
          internalType: "struct ResolvedCrossChainOrder",
          components: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "originChainId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "openDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "fillDeadline",
              type: "uint32",
              internalType: "uint32",
            },
            {
              name: "orderId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "maxSpent",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "minReceived",
              type: "tuple[]",
              internalType: "struct Output[]",
              components: [
                {
                  name: "token",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "recipient",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "chainId",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "fillInstructions",
              type: "tuple[]",
              internalType: "struct FillInstruction[]",
              components: [
                {
                  name: "destinationChainId",
                  type: "uint64",
                  internalType: "uint64",
                },
                {
                  name: "destinationSettler",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "originData",
                  type: "bytes",
                  internalType: "bytes",
                },
              ],
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "SafeERC20FailedOperation",
      inputs: [
        {
          name: "token",
          type: "address",
          internalType: "address",
        },
      ],
    },
  ],
};

export const INVEST_POOL = {
  address: "0x2D6f315E3D9955cc56455E4e8eA43d839a3ABDe6" as `0x${string}`,
  abi: [
    {
      type: "function",
      name: "balances",
      inputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "invest",
      inputs: [
        {
          name: "token",
          type: "address",
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "withdraw",
      inputs: [
        {
          name: "token",
          type: "address",
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "error",
      name: "SafeERC20FailedOperation",
      inputs: [
        {
          name: "token",
          type: "address",
          internalType: "address",
        },
      ],
    },
  ],
};
