import { useEffect, useState } from "react";
import './Css.css'
import { useWallet } from "use-wallet";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Web3 from 'web3';
import abi from '../pages/abi/stkingcontract.json';
import erc from '../pages/abi/erc20.json';
import Slider from '@mui/material/Slider';
import RangeSlider from 'react-bootstrap-range-slider';
import { Col } from "react-bootstrap";
import { Form, Row } from "react-bootstrap";

const MainPage = () => {

  const wallet = useWallet();

  const [staking_contract, setstakingContract] = useState("");
  const [approved, setapproved] = useState(false);
  const [userInfo, setuserInfo] = useState("");
  const [days, setdays] = useState(7);
  const [amount, setamount] = useState(5);
  const [refferalAddress, setrefferalAddress] = useState("0xd34e2294289bc709D8d62Ae23235346279741066")


  const loadContract = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const stakingContract = new web3.eth.Contract(abi, "0x09180Eb78a3cb64Db28d058382428f6553612ee9");

    setstakingContract(stakingContract);

    console.log(stakingContract, "stakingcontract");

    const userInfo = await stakingContract.methods.userInfo(wallet.account).call();

    setuserInfo(userInfo)
    console.log(userInfo);

  }

  const insertZero = (value,length) => {
    const intialValue = "000000000000000000";
    // const length = value.length;
    const finalstring = intialValue.slice(length);
    console.log(finalstring,value.concat(finalstring),"final");
    return value.concat(finalstring);
  }

  const handleAmount = (amount) => {
    if (amount.indexOf(".") != -1) {
      console.log("in if");
      const int = amount.split(".");
      console.log("int",int);
      const value = insertZero(int[1],int[1].length);
      const tens = int[0].concat("000000000000000000");
      const total = parseInt(tens)+parseInt(value);
      console.log(total);
      return total.toString();
      // return int.concat("0000000000000000000");
    } else {
      const value = amount.concat("000000000000000000");
      console.log(value);
      return value;
    }
  }

  const handleDeposit = async () => {

    const fianlAmount = handleAmount(amount)
    if (fianlAmount && days) {
      const tx = await staking_contract.methods.deposit(selectedDays, refferalAddress, fianlAmount).send({
        from: wallet.account
      })
      if (tx.status) {
        window.location.reload();
      } else {
        alert("transaction failed")
      }
    } else {
      alert("Please enter amount and days")
    }
  }


  const checkApproval = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const busdToken = new web3.eth.Contract(erc, "0x55d398326f99059fF775485246999027B3197955");

    console.log(busdToken);

    const allowance = await busdToken.methods.allowance(wallet.account, "0x09180Eb78a3cb64Db28d058382428f6553612ee9").call();
    console.log(allowance, "all");
    if (allowance === "0") {
      setapproved(false);
    } else {
      setapproved(true);
    }

  }


  const handleApprove = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const busdToken = new web3.eth.Contract(erc, "0x55d398326f99059fF775485246999027B3197955");

    console.log(busdToken);

    const tx = await busdToken.methods.approve("0x09180Eb78a3cb64Db28d058382428f6553612ee9", "100000000000000000000000000000000000000000000000000000000000000000000000").send({
      from: wallet.account
    });

    if (tx.status) {
      window.location.reload()
    } else {
      setapproved(false);
    }

  }


  useEffect(() => {

    if (wallet.status === "connected") {
      loadContract();

      checkApproval();
    }

    return () => {

    }
  }, [wallet.status, wallet.account, wallet])



  const renderButton = () => {
    if (approved) {
      <button className="btn measure_btn text-uppercase" onClick={() => {
        handleDeposit()
      }}>Deposit</button>
    } else {
      return (
        <button className="btn measure_btn text-uppercase" onClick={() => {
          handleApprove()
        }}>Enable</button>
      )
    }
  }


  const handleWithdrawl = async () => {
    const web3 = new Web3(Web3.givenProvider);
    // const stakingContract = new web3.eth.Contract(abi, "0x09180Eb78a3cb64Db28d058382428f6553612ee9");
    const tx = await staking_contract.methods.withdraw().send({
      from: wallet.account
    })
  }


  const [selectedDays, setSelectedDays] = useState(7);


  const [ value1, setValue1 ] = useState(25);

  return (
    <div>
      <div className="Toastify" />
      <div className="wrapper_outer">
        <Header />
        <section className="banner_section_outer"><div className="hero-caption"><div className="container-fluid"><div className="row d-md-flex align-items-md-center"><div className="col-sm-12 col-md-7 col-lg-7"><div className="banner-captions"><h2 className="banner-head-a">Stake and Earn up to 241% of your deposit BUSD<span>Binance Smart Chain.</span></h2><p className="py-md-2 py-1" /><h4 className="banner-head-b pt-1 pb-md-2" /><h4 className="banner-head-b pt-1 pb-md-2"><span>Get 8% to 18% ROI</span><span>And 5 levels of Referral Commissions</span></h4><p className="pt-md-1 pt-0" /><div className="banner-buttons"><a className="btn btn-a1 min-a text-center mr-md-2" href="#deposit">Deposit</a><a className="btn btn-a2 min-a text-center" href="#withdraw">Withdraw</a></div><p className="pt-md-1 pt-0" /><p className="pt-md-1 pt-0" /></div></div></div></div></div></section>
        <div className="container" id="deposit">
          <h2 className="top_heading">Measure your Harvest</h2>
          <div className="measure_section_outer">
            <div className="row">
          
              <div className="col-md-8">
                <div className="measure_section_inner">
                  <div className="vertically-stacked-slider">
                    <p>Deposit Period ({selectedDays} Days)</p>
                    <div className="range-slider">
                      {/* <input
                        className="range-slider__range"
                        type="range"
                        min={7}
                        max={30}
                        value={selectedDays}
                  
             
                        onChange={(e) => {
                          setSelectedDays(e.target.value);
                        }}
                      // defaultValue={selectedDays}
                      />
                     */}
                      <RangeSlider
                        min={7}
                        max={30}
                        type="range"
                        variant='warning'
                        value={selectedDays}
                        onChange={e =>  setSelectedDays(e.target.value)}
                        tooltip='on'
                        tooltipPlacement='top'
                        size='lg'
                      />
                        <span className="range-slider__value ">7</span>
                      <span className="range-slider__value f_right">30</span>
                    </div>
                  
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="deposit_amout">
                  <p>Deposit Amounts</p>
                  <input type="text" defaultValue={5} onChange={(e) => {
                    setamount(e.target.value);
                    handleAmount(e.target.value)
                  }} />
                  <span> Min: 5 BUSD</span>
                </div>
              </div>
            </div>
            <hr className="hr-a" />
            <div className="row">
              <div className="col-sm-4 col-md-4">
                <div className="measure_contnt">
                  <p>
                    Daily ROI<span>18.00%</span>
                  </p>
                </div>
              </div>
              <div className="col-sm-4 col-md-4">
                <div className="measure_contnt">
                  <p>
                    Total Profit<span>126.00%</span>
                  </p>
                </div>
              </div>
              <div className="col-sm-4 col-md-4">
                <div className="measure_contnt">
                  <p>
                    In 7 Days you will earn<span>63.00&nbsp;BUSD</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="measure_btn text-center">
              {renderButton()}
              {/* <button className="btn measure_btn text-uppercase">Enable</button> */}
            </div>
          </div>
        </div>
        <div className="container" id="withdraw">
          <div className="dashbord_outer">
            <h2 className="top_heading">Dashboard</h2>
            <div className="row">
              <div className="col-md-3">
                <div className="dashbord_contnt">
                  <p>
                    Total Investment<span>{userInfo?.total_invested} BUSD</span>
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dashbord_contnt">
                  <p>
                    Total Withdrawals<span>{userInfo?.total_withdrawn} BUSD</span>
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dashbord_contnt">
                  <p>
                    Total Referral Rewards<span>{userInfo?.total_match_bonus} BUSD</span>
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dashbord_contnt">
                  <p>
                    Available to Withdraw<span>{userInfo?.for_withdraw} BUSD</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="measure_btn text-center">
              <button className="btn measure_btn text-uppercase" onClick={() => {
                handleWithdrawl()
              }}>
                Withdraw
              </button>
            </div>
            <p className="pt-md-1 pt-0" />
            <p className="pt-md-1 pt-0" />
            <div className="refer_link text-center">
              <p>
                <span>Your Referral Link: </span>
                <span>You will get your ref link after investing.</span>
                <a className="ref-link-copy pointer">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAAEcp+bfAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEaADAAQAAAABAAAAFAAAAABGcxxxAAAB1ElEQVQ4Ec1USy8EQRCu6undDbs4IO7iGQlnRyJkd5DYxNEvEP+Bi1/gRxAJidduWFcnkXCSILg5EJfdtY+ZKVVjx/Y+rIuDOkxXf/X1191V1QPAVswsjssI+dP5JRlzqfl11T57tC8TMRRKONbxBNlUggRR8hHDfMpOEkKRiDYFiPZakxosJHK9o1j8BAUURSymF8ZAoyVAZObgRruKhryyuy4AC4MWh5dMyChbfu8iQIMJA3Np2yagFSR1azK0wu3I3KGPaVQYRsAdz/X2giMFZFFxyl6y9V4Vtm7r7DoXP/f+Hgg0jP6NfVI6sUUEq/UMDXoE6W4tUnp+Hq4PSmYE07n7hwKC2qgn8NwnoNRCbsMpuODsR00iIl756fRBghcmJk2CLP71yn9ACIW0X05zb9NXwX1N0PS/sxm0nhkExDeks+WuvJu/5BwM1AR/mChLJc3uFpr+oI9pEWgW/EGnAdbg8kswLJu2X4EoxNCTATe6iG3MG1So1vy3w0JVElE3N+9+NH5cU8Eq4cuTRi6XnWvuuJ5fC1e/uNn8/4joSrlqktvsyK2w6nOosDipJa7XqPycWi10HKdP4lySYtMTFDJ2P4IVayUChBTW4Uec2s1+AhFlr0spcNueAAAAAElFTkSuQmCC"
                    alt="copy link"
                  />
                </a>
              </p>
            </div>
            <p className="pt-md-1 pt-0" />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="offset-md-3 col-md-6">
              <div className="table-responsive">
                <p className="pt-md-1 pt-0" />
                <table className="table table-hover text-center">
                  <thead className="m3-table-head">
                    <tr>
                      <th>Referal Level </th>
                      <th> Rewards</th>
                      <th> No of Referral </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Level 1 </td>
                      <td>8% </td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Level 2 </td>
                      <td>2% </td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Level 3 </td>
                      <td>1% </td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Level 4 </td>
                      <td>0.5% </td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Level 5 </td>
                      <td>0.5% </td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="offset-md-1 col-md-10">
              <div className="dapp_radar_outer">
                <ul>
                  <li>
                    <a href="#" target="_blank" rel="noreferrer">
                      <img src="hazecrypto.png" alt="icon" />
                    </a>
                  </li>
                  <li>
                    <a href="https://dappradar.com/binance-smart-chain/high-risk/birdstake">
                      <img
                        className="imgDappRadar"
                        src="data:image/png;base64,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"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img
                        src="data:image/png;base64,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"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img
                        src="data:image/png;base64,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"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img
                        className="dappStats"
                        src="data:image/png;base64,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"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://bscscan.com/address/0x09180Eb78a3cb64Db28d058382428f6553612ee9"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        className="bsc"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAd0AAAB6CAMAAADNjXm+AAACXlBMVEVHcEz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1uwr////////yugD/////vwD////1uQjwuQvwuAr////////////xuwvwuAv/////////ugD////vuQr////xugr////////////wuQvwuQr////////vuArwuArxugnxvAfwuQrvuQrvtwjyuQjwuQr////wuQv////wuQj////wuQv////vuQv////xuQv////////////////zuwD/////////////////////xADyuQnxuQnwuAr////wuQv////////////////////////////wuQrxuQjvuQv/////////xAD////vuQrwuQr////////////wuAr////////////wuQr////////////////////0ugfwuAn////////////wuQn////////////wugnwuQr/tgD////xuAvxuAvvuAv////////////////wuArwuQrwuAr////yuQrwuArwuArwuQnwugrwuQr////////wuQvyuwb////wuQr////////wuQrvuwrxuAn////wuQr////////wuAr////////////vuQvvuAr////xuAvvuQr/uwD////////xugr/////xgDzuwbwuArwuQrvuAr////yuArwuQrwwwD////////wuQvLo9pPAAAAyHRSTlMAIDDwgGC/wEAQ73/Qz1CQvKDgsHDf5Z8ir/uPT2E/ODkhX28MFxgIjRI6DOcdYP2502hG6s2bA/P0KH/o2vao9w5EgudYI5rDQDu6G9cyQgF47fD6jwJKtgoV3nPiB1kNOG7Leu0S16aE6ho8tlqjoxkGduTG/mMesL57JP73xIvGmC1SeDGzVmaGQoisDn5ejfLHlUZW+d74kUxo0IozY8yIvSc1nbtShTA2znMWLdzCqmzSlOtdsw+drWszCSmee+AsT7URgQCAxsYAAA7BSURBVHja7Z33n9tEGodVbUmW7bjFLF4W2E0jvRFSjiSQ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"
                        alt="icon"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
