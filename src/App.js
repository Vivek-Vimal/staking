import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from "./pages/Main";
import { useWallet, UseWalletProvider } from "use-wallet";

function App() {
  return (
    <div className="App">
      <UseWalletProvider
        chainId={56}
        connectors={{
          // This is how connectors get configured
          portis: { dAppId: "my-dapp-id-123-xyz" },
        }}
      >
        <MainPage />
      </UseWalletProvider>
    </div>
  );
}

export default App;
