import { useEffect, useState } from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
import Web3 from "web3";
import erc from '../pages/abi/erc20.json';

const getShortWallet = (address) => {
  return `${address.substring(0, 5)}.... ${address.substring(
    address.length - 5,
    address.length
  )}`;
};

const getHandSomeNumber = (number) => {
  return (number / 1e18).toFixed(2);
};
const Header = () => {
  const wallet = useWallet();

  const [balannce, setbalannce] = useState(0)
  const balance = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const busdToken = new web3.eth.Contract(erc, "0x55d398326f99059fF775485246999027B3197955");

    const balandce = await busdToken.methods.balanceOf(wallet.account).call();
    console.log(balandce);
    setbalannce(balandce / 1e18);
    // return balannce;
  }

  useEffect(() => {
    wallet.connect();

  }, [])

  useEffect(() => {
    if (wallet.status == "connected") {
      balance()
    }

    return () => {

    }
  }, [wallet.status, wallet.account, wallet])


  return (
    <section className="top_section_outer">
      <nav className="nav-es navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="nav-header">
            <a className="navbar-brand" href="https://birdstaking.com/">
              <img src="logo.png" alt="logo" className="img-fluid" />
            </a>
          </div>
          <div className="nav-right">
            <div className="topbar-button">
              <div className="ds-flex">
                {wallet.account ? (
                  <div className="ds-flex-col">
                    <p>Wallet: {getShortWallet(wallet.account)}</p>
                    <p>BUSD Balance: {balannce}</p>
                  </div>
                ) : null}
                <button
                  className="btn btn-a0 text-uppercase"
                  onClick={() => {
                    if (wallet.account) {
                      wallet.reset();
                    } else {
                      wallet.connect();
                    }
                  }}
                >
                  {wallet.account ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Header;
