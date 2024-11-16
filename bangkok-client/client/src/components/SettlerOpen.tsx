import {
  type BaseError,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseUnits,
  getContract,
} from "viem";

import { useWaitForTransactionReceipt } from "wagmi";
import { client } from "../config";
import { DEFAULT_ERC20, INVEST_POOL, SETTLER } from "../contracts";
import { Account } from "../modules/Account";
import { parseSignature, sign } from "webauthn-p256";
import { PrimaryButton } from "./Button";
import axios from "axios";

export function SettlerOpen({
  account,
  amount,
  setAmount,
}: {
  account: Account.Account;
  amount: string;
  setAmount: (amount: string) => void;
}) {
  const {
    data: hash,
    mutate: execute,
    mutateAsync: executeAsync,
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
      "0x6d911b1876ad24ca46939cd79dc8c65d06f956b2fa247efb05bde6ce4d7cb983"; // Replace with your actual type hash
    const TOKEN_ADDRESS = DEFAULT_ERC20.address; // Your token address

    const mekongChainId = 7078815900n;

    const xCallApprove = {
      target: DEFAULT_ERC20.address as `0x${string}`,
      callData: encodeFunctionData({
        abi: DEFAULT_ERC20.abi,
        functionName: "approve",
        args: [
          INVEST_POOL.address as `0x${string}`,
          parseUnits("10000000000", 6),
        ],
      }) as `0x${string}`,
      value: 0n,
    };

    const xCallInvest = {
      target: INVEST_POOL.address as `0x${string}`,
      callData: encodeFunctionData({
        abi: INVEST_POOL.abi,
        functionName: "invest",
        args: [TOKEN_ADDRESS as `0x${string}`, parseUnits(amount, 6)],
      }) as `0x${string}`,
      value: 0n,
    };

    const orderData = {
      token: TOKEN_ADDRESS as `0x${string}`,
      amount: parseUnits(amount, 6),
      dstChainId: mekongChainId,
      xCalls: [xCallApprove, xCallInvest] as const, // Empty array for xCalls
    };

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
                components: [
                  { name: "target", type: "address" },
                  { name: "callData", type: "bytes" },
                  { name: "value", type: "uint256" },
                ],
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
              components: [
                { name: "target", type: "address" },
                { name: "callData", type: "bytes" },
                { name: "value", type: "uint256" },
              ],
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

    try {
      await executeAsync({
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

      setAmount("");

      console.log(
        order,
        JSON.stringify({
          signature: finalSignature,
          hash,
        })
      );

      const settlementContract = getContract({
        address: SETTLER.address as `0x${string}`,
        abi: SETTLER.abi,
        client,
      });

      const resolvedOrder: any = await settlementContract.read.resolve([order]);
      console.log("Resolved order: ", resolvedOrder);

      const maxSpent = resolvedOrder?.maxSpent[0];
      const minReceived = resolvedOrder?.minReceived[0];
      const fillInstructions = resolvedOrder?.fillInstructions[0];

      await axios.post("http://localhost:8000/new_onchain_order", {
        user: account.address,
        originChainId: Number(resolvedOrder?.originChainId),
        openDeadline: Number(resolvedOrder?.openDeadline),
        fillDeadline: Number(resolvedOrder?.fillDeadline),
        orderId: resolvedOrder?.orderId,
        maxSpent: [
          {
            ...maxSpent,
            amount: Number(maxSpent.amount),
            chainId: Number(maxSpent.chainId),
          },
        ],
        minReceived: [
          {
            ...minReceived,
            amount: Number(minReceived.amount),
            chainId: Number(minReceived.chainId),
          },
        ],
        fillInstructions: [
          {
            ...fillInstructions,
            destinationChainId: Number(fillInstructions.destinationChainId),
          },
        ],
        transactionHash: hash,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full">
      <PrimaryButton
        disabled={isPending}
        onClick={handleSettlerOpen}
        className="flex w-full items-center justify-center mt-4"
      >
        {isPending ? "Depositing..." : "Deposit"}
      </PrimaryButton>
      {error && <p>{(error as BaseError).shortMessage ?? error.message}</p>}
      {isSuccess && (
        <p className="ml-auto text-center mr-auto mt-4">
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            See on Explorer
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
