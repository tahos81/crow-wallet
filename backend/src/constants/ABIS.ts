export const ABIS = {
  ACCOUNT: [
    {
      inputs: [
        {
          internalType: 'tuple',
          name: 'order',
          type: 'tuple',
          components: [
            { internalType: 'address', name: 'originSettler', type: 'address' },
            { internalType: 'address', name: 'user', type: 'address' },
            { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            { internalType: 'uint256', name: 'originChainId', type: 'uint256' },
            { internalType: 'uint32', name: 'openDeadline', type: 'uint32' },
            { internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
            { internalType: 'bytes32', name: 'orderDataType', type: 'bytes32' },
            { internalType: 'bytes', name: 'orderData', type: 'bytes' },
          ],
        },
        { internalType: 'bytes', name: 'originFillerData', type: 'bytes' },
      ],
      name: 'resolveFor',
      outputs: [
        {
          internalType: 'tuple',
          components: [
            { internalType: 'address', name: 'user', type: 'address' },
            { internalType: 'uint256', name: 'originChainId', type: 'uint256' },
            { internalType: 'uint32', name: 'openDeadline', type: 'uint32' },
            { internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
            { internalType: 'bytes32', name: 'orderId', type: 'bytes32' },
            {
              internalType: 'tuple[]',
              name: 'maxSpent',
              components: [
                { internalType: 'bytes32', name: 'token', type: 'bytes32' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'bytes32', name: 'recipient', type: 'bytes32' },
                { internalType: 'uint256', name: 'chainId', type: 'uint256' },
              ],
            },
            {
              internalType: 'tuple[]',
              name: 'minReceived',
              components: [
                { internalType: 'bytes32', name: 'token', type: 'bytes32' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'bytes32', name: 'recipient', type: 'bytes32' },
                { internalType: 'uint256', name: 'chainId', type: 'uint256' },
              ],
            },
            {
              internalType: 'tuple[]',
              name: 'fillInstructions',
              components: [
                {
                  internalType: 'uint64',
                  name: 'destinationChainId',
                  type: 'uint64',
                },
                {
                  internalType: 'bytes32',
                  name: 'destinationSettler',
                  type: 'bytes32',
                },
                { internalType: 'bytes', name: 'originData', type: 'bytes' },
              ],
            },
          ],
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'tuple',
          name: 'order',
          type: 'tuple',
          components: [
            { internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
            { internalType: 'bytes32', name: 'orderDataType', type: 'bytes32' },
            { internalType: 'bytes', name: 'orderData', type: 'bytes' },
          ],
        },
      ],
      name: 'resolve',
      outputs: [
        {
          internalType: 'tuple',
          components: [
            { internalType: 'address', name: 'user', type: 'address' },
            { internalType: 'uint256', name: 'originChainId', type: 'uint256' },
            { internalType: 'uint32', name: 'openDeadline', type: 'uint32' },
            { internalType: 'uint32', name: 'fillDeadline', type: 'uint32' },
            { internalType: 'bytes32', name: 'orderId', type: 'bytes32' },
            {
              internalType: 'tuple[]',
              name: 'maxSpent',
              components: [
                { internalType: 'bytes32', name: 'token', type: 'bytes32' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'bytes32', name: 'recipient', type: 'bytes32' },
                { internalType: 'uint256', name: 'chainId', type: 'uint256' },
              ],
            },
            {
              internalType: 'tuple[]',
              name: 'minReceived',
              components: [
                { internalType: 'bytes32', name: 'token', type: 'bytes32' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'bytes32', name: 'recipient', type: 'bytes32' },
                { internalType: 'uint256', name: 'chainId', type: 'uint256' },
              ],
            },
            {
              internalType: 'tuple[]',
              name: 'fillInstructions',
              components: [
                {
                  internalType: 'uint64',
                  name: 'destinationChainId',
                  type: 'uint64',
                },
                {
                  internalType: 'bytes32',
                  name: 'destinationSettler',
                  type: 'bytes32',
                },
                { internalType: 'bytes', name: 'originData', type: 'bytes' },
              ],
            },
          ],
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  ERC20: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'subtractedValue',
          type: 'uint256',
        },
      ],
      name: 'decreaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'addedValue',
          type: 'uint256',
        },
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  SETTLEMENT: [
    {
      type: 'constructor',
      inputs: [
        {
          name: '_permit2',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'PERMIT2',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'contract IPermit2',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'open',
      inputs: [
        {
          name: 'order',
          type: 'tuple',
          internalType: 'struct OnchainCrossChainOrder',
          components: [
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderDataType',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'orderData',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'openFor',
      inputs: [
        {
          name: 'order',
          type: 'tuple',
          internalType: 'struct GaslessCrossChainOrder',
          components: [
            {
              name: 'originSettler',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'user',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'nonce',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'originChainId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'openDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderDataType',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'orderData',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
        },
        {
          name: 'signature',
          type: 'bytes',
          internalType: 'bytes',
        },
        {
          name: 'originFillerData',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'resolve',
      inputs: [
        {
          name: 'order',
          type: 'tuple',
          internalType: 'struct OnchainCrossChainOrder',
          components: [
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderDataType',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'orderData',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
        },
      ],
      outputs: [
        {
          name: 'resolvedOrder',
          type: 'tuple',
          internalType: 'struct ResolvedCrossChainOrder',
          components: [
            {
              name: 'user',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'originChainId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'openDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderId',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'maxSpent',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'minReceived',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'fillInstructions',
              type: 'tuple[]',
              internalType: 'struct FillInstruction[]',
              components: [
                {
                  name: 'destinationChainId',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'destinationSettler',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'originData',
                  type: 'bytes',
                  internalType: 'bytes',
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'resolveFor',
      inputs: [
        {
          name: 'order',
          type: 'tuple',
          internalType: 'struct GaslessCrossChainOrder',
          components: [
            {
              name: 'originSettler',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'user',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'nonce',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'originChainId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'openDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderDataType',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'orderData',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
        },
        {
          name: 'originFillerData',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [
        {
          name: 'resolvedOrder',
          type: 'tuple',
          internalType: 'struct ResolvedCrossChainOrder',
          components: [
            {
              name: 'user',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'originChainId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'openDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderId',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'maxSpent',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'minReceived',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'fillInstructions',
              type: 'tuple[]',
              internalType: 'struct FillInstruction[]',
              components: [
                {
                  name: 'destinationChainId',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'destinationSettler',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'originData',
                  type: 'bytes',
                  internalType: 'bytes',
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'event',
      name: 'Open',
      inputs: [
        {
          name: 'orderId',
          type: 'bytes32',
          indexed: true,
          internalType: 'bytes32',
        },
        {
          name: 'resolvedOrder',
          type: 'tuple',
          indexed: false,
          internalType: 'struct ResolvedCrossChainOrder',
          components: [
            {
              name: 'user',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'originChainId',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'openDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'fillDeadline',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'orderId',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'maxSpent',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'minReceived',
              type: 'tuple[]',
              internalType: 'struct Output[]',
              components: [
                {
                  name: 'token',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'recipient',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
            {
              name: 'fillInstructions',
              type: 'tuple[]',
              internalType: 'struct FillInstruction[]',
              components: [
                {
                  name: 'destinationChainId',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'destinationSettler',
                  type: 'bytes32',
                  internalType: 'bytes32',
                },
                {
                  name: 'originData',
                  type: 'bytes',
                  internalType: 'bytes',
                },
              ],
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: 'error',
      name: 'SafeERC20FailedOperation',
      inputs: [
        {
          name: 'token',
          type: 'address',
          internalType: 'address',
        },
      ],
    },
  ],
};