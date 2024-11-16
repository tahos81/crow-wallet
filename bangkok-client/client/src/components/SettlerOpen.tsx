import {
  type BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseUnits,
} from "viem";

import { useWaitForTransactionReceipt } from "wagmi";
import { client } from "../config";
import { DEFAULT_ERC20, SETTLER } from "../contracts";
import { Account } from "../modules/Account";
import { parseSignature, sign } from "webauthn-p256";

export function SettlerOpen({ account }: { account: Account.Account }) {
  const {
    data: hash,
    mutate: execute,
    error,
    ...executeQuery
  } = Account.useExecute({
    client,
  });

  const receiptQuery = useWaitForTransactionReceipt({ hash });

  const isPending =
    receiptQuery.fetchStatus === "fetching" || executeQuery.isPending;
  const isSuccess = receiptQuery.isSuccess && executeQuery.isSuccess;

  const handleSettlerOpen = async () => {
    const CROW_ORDER_DATA_TYPE_HASH =
      "0x14a1ec3370924385dde81afb955e8b7b4622456fd879688f69853490fdbfb263"; // Replace with your actual type hash
    const TOKEN_ADDRESS = "0xc6Ab1437507B4156b4DbFbe061b369f0973Be8F4"; // Your token address

    const orderData = {
      token: TOKEN_ADDRESS as `0x${string}`,
      amount: parseUnits("1", 6), // Converts 1 ether to wei
      dstChainId: 911867n,
      xCalls: [], // Empty array for xCalls
    };

    const mekongChainId = BigInt(7078815900);

    const orderDataHash = keccak256(
      encodeAbiParameters(
        [
          {
            components: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
              { name: "dstChainId", type: "uint256" },
              {
                name: "xCalls",
                type: "tuple[]",
                components: [], // Add XCall components if needed
              },
            ],
            type: "tuple",
          },
          { type: "uint256" },
        ],
        [orderData, mekongChainId]
      )
    );

    const { signature } = await sign({
      hash: orderDataHash,
      credentialId: account.key.id,
    });

    const { r, s } = parseSignature(signature);

    console.log({ r, s });

    const finalSignature = formatHex(
      parseHex(r.toString()) + parseHex(s.toString())
    );

    const encodedOrderData = encodeAbiParameters(
      [
        {
          components: [
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "dstChainId", type: "uint256" },
            {
              name: "xCalls",
              type: "tuple[]",
              components: [], // Add XCall components if needed
            },
          ],
          type: "tuple",
        },
        { type: "bytes" },
      ],
      [orderData, finalSignature] // Second parameter is empty bytes
    );

    // Calculate fill deadline (current timestamp + 1 day in seconds)
    const fillDeadline = BigInt(Math.floor(Date.now() / 1000) + 24 * 60 * 60);

    // Final order object
    const order = {
      fillDeadline,
      orderDataType: CROW_ORDER_DATA_TYPE_HASH,
      orderData: encodedOrderData,
    };

    execute({
      account,
      calls: [
        {
          to: DEFAULT_ERC20.address,
          data: encodeFunctionData({
            abi: DEFAULT_ERC20.abi,
            functionName: "approve",
            args: [
              SETTLER.address as `0x${string}`,
              parseUnits("10000000000", 6),
            ],
          }),
        },
        {
          to: SETTLER.address as `0x${string}`,
          data: encodeFunctionData({
            abi: SETTLER.abi,
            functionName: "open",
            args: [order],
          }),
        },
      ],
    });

    console.log(
      order,
      JSON.stringify({
        signature: finalSignature,
        hash,
      })
    );
  };

  return (
    <div>
      <button
        disabled={isPending || isSuccess}
        onClick={handleSettlerOpen}
        type="button"
      >
        {isPending ? "Opening..." : "Open Settler"}
      </button>
      {error && <p>{(error as BaseError).shortMessage ?? error.message}</p>}
      {isSuccess && (
        <p>
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )}
    </div>
  );
}

const parseHex = (hex: string) => {
  if (hex.startsWith("0x")) {
    return hex.slice(2);
  }
  return hex;
};

const formatHex = (hex: string) => {
  return `0x${hex}` as `0x${string}`;
};
