import { Account } from "./modules/Account";
import "./index.css";
import { MainWrapper } from "./components/MainWrapper";
import { PrimaryButton, SecondaryButton } from "./components/Button";
import { client } from "./config";
import Logo from "./assets/logo.png";

import { useReadContract } from "wagmi";
import { DEFAULT_ERC20, INVEST_POOL } from "./contracts";
import { createPublicClient, defineChain, formatUnits, http } from "viem";
import SendIcon from "./assets/send.png";
import ReceiveIcon from "./assets/receive.png";
import DepositIcon from "./assets/deposit.png";
import USDCIcon from "./assets/usdc.png";
import OptimisimIcon from "./assets/op.png";
import { useEffect, useState } from "react";
import { mergeClasses } from "./utils/mergeClasses";
import { SettlerOpen } from "./components/SettlerOpen";

export const mekong = defineChain({
  id: 7078815900,
  name: "Mekong",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mekong.ethpandaops.io"],
    },
  },
});

export function App() {
  const { data: account } = Account.useQuery();

  if (account) {
    return <Home />;
  } else {
    return <AuthView />;
  }
}

export function AuthView() {
  const { data: hash, ...createMutation } = Account.useCreate({
    client,
  });

  const loadingMutation = Account.useLoad({
    client,
  });

  return (
    <MainWrapper>
      <div className="w-56 h-56 m-auto">
        <img src={Logo} />
      </div>

      <div className="mt-auto mb-10 space-y-3 flex flex-col">
        <PrimaryButton
          onClick={() => {
            createMutation.mutate();
          }}
        >
          Register
        </PrimaryButton>

        <SecondaryButton
          onClick={() => {
            loadingMutation.mutate();
          }}
        >
          Login
        </SecondaryButton>
      </div>
    </MainWrapper>
  );
}

export function Home() {
  const { data: account } = Account.useQuery();
  const [positionState, setPositionState] = useState<"deposit" | "withdraw">(
    "deposit"
  );
  const [amount, setAmount] = useState<string>("");

  const { data: balance } = useReadContract({
    ...DEFAULT_ERC20,
    functionName: "balanceOf",
    args: [account!.address],
    query: {
      refetchInterval: 1000,
    },
  });

  if (account == null) {
    return null;
  }

  const boxClasses =
    "bg-[rgba(0,0,0,0.30)] rounded-2xl justify-center items-center flex flex-col p-4 pt-8 pb-8 border-1 border-white/80";
  const activeTab = "bg-[rgba(80,5,229,0.8)]";

  return (
    <MainWrapper blur={true}>
      <div className={`${boxClasses} mt-8`}>
        <div>
          {typeof balance === "bigint" && (
            <span className="text-[64px] font-light">
              ${formatUnits(balance, 6)}{" "}
            </span>
          )}
        </div>
        <div
          className="text-center whitespace-pre-wrap max-w-[90%]"
          style={{ overflowWrap: "anywhere" }}
        >
          {account.address}
        </div>
        <div className="flex space-x-4 mt-10 justify-around w-full">
          <img className="cursor-pointer" src={SendIcon} />
          <img className="cursor-pointer" src={DepositIcon} />
          <img className="cursor-pointer" src={ReceiveIcon} />
        </div>
      </div>
      <div className={`${boxClasses} mt-4 pt-4 pb-4`}>
        <div className="flex w-full justify-between items-center">
          <div className="flex space-x-2">
            <img className="w-8 h-8" src={USDCIcon} />
            <span>USDC</span>
          </div>
          <div className="flex space-x-2">
            <img className="w-12 h-12" src={OptimisimIcon} />
          </div>
        </div>
        <div className="flex w-full justify-between items-center mt-4">
          <div className="flex bg-[#020204] rounded-lg w-full">
            <div
              onClick={() => {
                setPositionState("deposit");
              }}
              className={mergeClasses(
                "p-2 rounded-lg bg-[#020204] w-full text-center cursor-pointer",
                positionState === "deposit" ? activeTab : ""
              )}
            >
              Deposit
            </div>
            <div
              onClick={() => {
                setPositionState("withdraw");
              }}
              className={mergeClasses(
                "p-2 rounded-lg bg-[#020204] w-full text-center cursor-pointer",
                positionState === "withdraw" ? activeTab : ""
              )}
            >
              Withdraw
            </div>
          </div>
        </div>
        {positionState === "deposit" ? (
          <div className="mt-8 w-full space-y-4">
            <span>APY: 11.7%</span>
            <div className="flex justify-between items-center w-full">
              <input
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                type="text"
                placeholder="0.00"
                className="h-[48px] w-full border-1 bg-transparent px-4 rounded-lg border-white bg-"
              />
            </div>
            <SettlerOpen
              account={account}
              amount={amount}
              setAmount={setAmount}
            />
          </div>
        ) : (
          <MekongBalance />
        )}
      </div>
    </MainWrapper>
  );
}

const MekongBalance = () => {
  const { data: account } = Account.useQuery();
  const [state, setState] = useState("0");

  const fetchBalance = async () => {
    const publicClient = createPublicClient({
      transport: http(),
      chain: mekong,
    });

    const balance = await publicClient.readContract({
      ...INVEST_POOL,
      functionName: "balances",
      args: [account!.address],
    });

    console.log("balacne: ", balance);

    if (balance) {
      setState(formatUnits(balance as unknown as bigint, 6));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="mt-8 w-full space-y-4">
      <span>Balance: {state} USDC</span>
    </div>
  );
};
