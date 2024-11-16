import { Account } from "./modules/Account";
import "./index.css";
import { MainWrapper } from "./components/MainWrapper";
import { PrimaryButton, SecondaryButton } from "./components/Button";
import { client } from "./config";
import { AccountDetails } from "./components/AccountDetails";
import { Mint } from "./components/Mint";
import { Send } from "./components/Send";

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
      <div className="mt-auto mb-4 space-y-4 flex flex-col">
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

  if (account == null) {
    return null;
  }

  return (
    <MainWrapper>
      <AccountDetails account={account} />
      <Mint account={account} />
      <Send account={account} />
    </MainWrapper>
  );
}

{
  /* <h1>Example EIP-7702 Delegation</h1>

<h2>1. Initialize</h2>
<InitializeAccount />

{account && (
  <>
    <h2>2. Account</h2>
    <AccountDetails account={account} />

    <h2>3. Mint EXP (ERC20)</h2>
    <Mint account={account} />

    <h2>4. Batch Send EXP</h2>
    <Send account={account} />
  </>
)} */
}
