import { useMutation, useQuery as useQuery_ } from "@tanstack/react-query";
import {
  type Address,
  type Hex,
  type PrivateKeyAccount,
  bytesToHex,
  concat,
  createPublicClient,
  encodePacked,
  hexToBytes,
  http,
  keccak256,
  parseSignature,
  size,
  slice,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import { signAuthorization } from "viem/experimental";
import {
  type PublicKey,
  createCredential,
  parsePublicKey,
  sign,
} from "webauthn-p256";

import { type Client, queryClient } from "../config";
import { ExperimentDelegation } from "../contracts";
import { mekong } from "../App";

export namespace Account {
  /////////////////////////////////////////////////////////
  // Types
  /////////////////////////////////////////////////////////

  export type Account = {
    address: Address;
    authTransactionHash?: Hex;
    key: {
      id: string;
      publicKey: {
        x: bigint;
        y: bigint;
      };
    };
  };

  export type Calls = { to: Address; value?: bigint; data?: Hex }[];

  /////////////////////////////////////////////////////////
  // Actions
  /////////////////////////////////////////////////////////

  /**
   * Generates a new EOA and injects the ExperimentDelegation contract onto it
   * with an authorized WebAuthn public key.
   */
  export async function create({ client }: { client: Client }) {
    // Generate a new EOA. This Account will be used to inject the ExperimentDelegation
    // contract onto it.
    const account = privateKeyToAccount(generatePrivateKey());

    // Create a WebAuthn credential which will be used as an authorized key
    // for the EOA.
    const credential = await createCredential({
      user: {
        name: `Crow Wallet (${truncate(account.address)})`,
        id: hexToBytes(account.address),
      },
    });

    const publicKey = parsePublicKey(credential.publicKey);

    // Authorize the WebAuthn key on the EOA.
    const hash = await authorize({
      account,
      client,
      publicKey,
    });

    await waitForTransactionReceipt(client, { hash });

    queryClient.setQueryData(["account"], {
      address: account.address,
      authTransactionHash: hash,
      key: {
        id: credential.id,
        publicKey,
      },
    });

    return hash;
  }

  /**
   * Authorizes a WebAuthn public key on an EOA by sending an EIP-7702 authorization
   * transaction to inject the ExperimentDelegation contract onto it.
   */
  export async function authorize({
    account,
    client,
    publicKey,
  }: {
    account: PrivateKeyAccount;
    client: Client;
    publicKey: PublicKey;
  }) {
    const nonce = 0n; // initial nonce will always be 0
    const expiry = 0n; // no expiry

    // Compute digest to sign for the authorize function.
    const digest = keccak256(
      encodePacked(
        ["uint256", "uint256", "uint256", "uint256"],
        [nonce, publicKey.x, publicKey.y, expiry]
      )
    );

    // Sign the authorize digest and parse signature to object format required by
    // the contract.
    const signature = parseSignature(await account.sign({ hash: digest }));

    const mekongClient = createPublicClient({
      chain: mekong,
      transport: http(),
    });

    // Sign an EIP-7702 authorization to inject the ExperimentDelegation contract
    // onto the EOA.
    const authorization = await signAuthorization(client, {
      account,
      contractAddress: ExperimentDelegation.address,
      delegate: true,
    });

    const mekongAuthorization = await signAuthorization(mekongClient, {
      account,
      contractAddress: ExperimentDelegation.address,
      delegate: true,
    });

    // Empty PK, never push actual private keys to github
    const sequencer = privateKeyToAccount(
      "0xa16e0cf57ccb0245ac483b4cac8d64e37b1042fc9281ca358804a050ddcd2872"
    );

    // Send an EIP-7702 contract write to authorize the WebAuthn key on the EOA.
    const hash = await writeContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: "authorize",
      args: [
        {
          x: publicKey.x,
          y: publicKey.y,
        },
        expiry,
        {
          r: BigInt(signature.r),
          s: BigInt(signature.s),
          yParity: signature.yParity,
        },
      ],
      authorizationList: [authorization],
      account: sequencer,
    });

    await writeContract(mekongClient, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: "authorize",
      args: [
        {
          x: publicKey.x,
          y: publicKey.y,
        },
        expiry,
        {
          r: BigInt(signature.r),
          s: BigInt(signature.s),
          yParity: signature.yParity,
        },
      ],
      authorizationList: [mekongAuthorization],
      account: sequencer,
    });

    return hash;
  }

  /**
   * Imports an existing EOA that holds an authorized WebAuthn public key
   * into account state.
   */
  export async function load({ client }: { client: Client }) {
    // Sign an empty hash to extract the user's WebAuthn credential.
    const { raw } = await sign({
      hash: "0x",
    });

    // Extract the EOA address from the WebAuthn user handle.
    const response = raw.response as AuthenticatorAssertionResponse;
    const address = bytesToHex(new Uint8Array(response.userHandle!));

    // Extract the authorized WebAuthn key from the delegated EOA's contract.
    const [, , publicKey] = await readContract(client, {
      address,
      abi: ExperimentDelegation.abi,
      functionName: "keys",
      args: [0n],
    });

    queryClient.setQueryData(["account"], {
      address,
      delegation: ExperimentDelegation.address,
      key: {
        id: raw.id,
        publicKey,
      },
    });
  }

  /**
   * Executes calls with the delegated EOA's WebAuthn credential.
   */
  export async function execute({
    account,
    calls,
    client,
  }: {
    account: Account;
    calls: Calls;
    client: Client;
  }) {
    // Fetch the next available nonce from the delegated EOA's contract.
    const nonce = await readContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: "nonce",
    });

    // Encode calls into format required by the contract.
    const calls_encoded = concat(
      calls.map((call) =>
        encodePacked(
          ["uint8", "address", "uint256", "uint256", "bytes"],
          [
            0,
            call.to,
            call.value ?? 0n,
            BigInt(size(call.data ?? "0x")),
            call.data ?? "0x",
          ]
        )
      )
    );

    // Compute digest to sign for the execute function.
    const digest = keccak256(
      encodePacked(["uint256", "bytes"], [nonce, calls_encoded])
    );

    // Sign the digest with the authorized WebAuthn key.
    const { signature, webauthn } = await sign({
      hash: digest,
      credentialId: account.key.id,
    });

    // Extract r and s values from signature.
    const r = BigInt(slice(signature, 0, 32));
    const s = BigInt(slice(signature, 32, 64));

    // Execute calls.
    return await writeContract(client, {
      abi: ExperimentDelegation.abi,
      address: account.address,
      functionName: "execute",
      args: [calls_encoded, { r, s }, webauthn, 0],
      account: null, // defer to sequencer to fill
    });
  }

  /////////////////////////////////////////////////////////
  // Query
  /////////////////////////////////////////////////////////

  const queryKey = ["account"];

  export function useQuery() {
    return useQuery_<Account>({ queryKey });
  }

  export function useCreate({ client }: { client: Client }) {
    return useMutation({
      mutationFn: async () => await create({ client }),
    });
  }

  export function useExecute({ client }: { client: Client }) {
    return useMutation({
      mutationFn: async ({
        account,
        calls,
      }: {
        account: Account;
        calls: Calls;
      }) => await execute({ account, calls, client }),
    });
  }

  export function useLoad({ client }: { client: Client }) {
    return useMutation({
      mutationFn: async () => await load({ client }),
    });
  }
}

function truncate(
  str: string,
  { start = 8, end = 6 }: { start?: number; end?: number } = {}
) {
  if (str.length <= start + end) return str;
  return `${str.slice(0, start)}\u2026${str.slice(-end)}`;
}
