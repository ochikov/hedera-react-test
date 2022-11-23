import logo from "./logo.svg";
import "./App.css";
import {
  Client,
  AccountId,
  AccountBalanceQuery,
  PrivateKey,
  Hbar,
  TransferTransaction,
} from "@hashgraph/sdk";

function App() {
  const test = async () => {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = AccountId.fromString();
    const newAccountId = AccountId.fromString();
    const myPrivateKey = PrivateKey.fromString();

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error(
        "Environment variables myAccountId and myPrivateKey must be present"
      );
    }

    // Create Hedera Testnet Client

    //The client has a default max transaction fee of 100,000,000 tinybars (1 hbar) and default max query payment of 100,000,000 tinybars (1 hbar).
    // If you need to change these values, you can use.setMaxDefaultTransactionFee() for a transaction and .setDefaultMaxQueryPayment() for queries.
    // So the max transaction fee is 1 hbar and the max query fee is 1 hbar, but those values can be changed
    const client = Client.forMainnet();

    // The operator is the account that will pay for the transaction query fees in HBAR
    client.setOperator(myAccountId, myPrivateKey);

    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    console.log("Start");
    console.log(new Date().toLocaleTimeString());

    for (let i = 0; i < 1000; i++) {
      try {
        // Send HBARs
        const transferHbar = await new TransferTransaction()
          .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1))
          .addHbarTransfer(newAccountId, Hbar.fromTinybars(1))
          .execute(client);

        //Verify the transaction reached consensus
        const transferReceipt = await transferHbar.getReceipt(client);
        console.log("The transfer is", transferReceipt.status.toString());

        // Get balance of Account 1
        const accountBalance = await new AccountBalanceQuery()
          .setAccountId("0.0.1420842")
          .setMaxAttempts(10)
          .execute(client);
        console.log("First Account Balance:", accountBalance.hbars.toString());

        // Get balance of Account 2
        const accountBalance2 = await new AccountBalanceQuery()
          .setAccountId("0.0.1444354")
          .setMaxAttempts(10)
          .execute(client);
        console.log(
          "Second Account Balance:",
          accountBalance2.hbars.toString()
        );
      } catch (e) {
        console.log(new Date().toLocaleTimeString());
        console.log(e);
      }
      await timer(10000);
    }

    console.log("End");
    console.log(new Date().toLocaleTimeString());
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={() => test()}>Test</button>
    </div>
  );
}

export default App;
