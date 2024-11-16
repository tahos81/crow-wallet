import {
  type BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  parseUnits,
} from "viem";

import { useWaitForTransactionReceipt } from "wagmi";
import { client } from "../config";
import { DEFAULT_ERC20, SETTLER } from "../contracts";
import { Account } from "../modules/Account";

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

  const handleSettlerOpen = () => {
    const CROW_ORDER_DATA_TYPE_HASH =
      "0x14a1ec3370924385dde81afb955e8b7b4622456fd879688f69853490fdbfb263"; // Replace with your actual type hash
    const TOKEN_ADDRESS = "0xc6Ab1437507B4156b4DbFbe061b369f0973Be8F4"; // Your token address

    const orderData = {
      token: TOKEN_ADDRESS as `0x${string}`,
      amount: parseUnits("1", 6), // Converts 1 ether to wei
      dstChainId: 911867n,
      xCalls: [], // Empty array for xCalls
    };

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
      [orderData, "0x"] // Second parameter is empty bytes
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
  };

  return (
    <div>
      <p>Mint some EXP (ERC20) to your account by clicking the button below.</p>
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
