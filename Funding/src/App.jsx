import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { LoadContract } from "./Utils/LoadContract";
import detectEthereumProvider from "@metamask/detect-provider";

const App = () => {
  let [WEB3Api, setWEB3Api] = React.useState({
    MyContract: null,
    Provider: null,
    WEB3: null,
  });
  let [Account, setAccount] = React.useState(null);
  let [Balance, setBalance] = React.useState(null);
  let [Reload, setReload] = React.useState(false);
  let [User, setUser] = React.useState(null);
  useEffect(() => {
    let Load = async () => {
      // If We Connect to Metamask Graphically

      // console.log(window.web3);
      // console.log(window.ethereum);

      /*
      let Provider = null;
      if (window.ethereum) {
        Provider = window.ethereum;
        try {
          Provider.enable();
        } catch {
          alert("User is Not Allowed");
        }
      } else if (window.web3) {
        Provider = window.web3.currentProvider;
      } else if (!process?.env?.production) {
        Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }
      Provider &&
        setWEB3Api({ ...WEB3Api, Provider, WEB3: new Web3(Provider),MyContract:await LoadContract("Funder",Provider) });
      
      */

      // This Method is Used to Connect to Metamask Programmatically Using @metamask/detect-provider

      detectEthereumProvider().then(async (Provider) => {
        Provider.request({ method: "eth_requestAccounts" });
        setWEB3Api({
          ...WEB3Api,
          Provider,
          WEB3: new Web3(Provider),
          MyContract: await LoadContract("Funder", Provider),
        });
      });
    };
    Load();
  }, []);

  useEffect(() => {
    let GetAccount = async () => {
      let Accounts = await WEB3Api.WEB3.eth.getAccounts();
      setAccount(Accounts[0]);

      const Bal = await WEB3Api.WEB3.eth.getBalance(
        WEB3Api.MyContract.options.address
      );
      setBalance(Web3.utils.fromWei(Bal, "ether"));

      let Count = await WEB3Api.MyContract.methods.Count().call();
      let Temp = [];
      for (let i = 0; i < Count; i++) {
        Temp.push(await WEB3Api.MyContract.methods.Fundings(i).call());
      }
      setUser(Temp);
    };
    WEB3Api.WEB3 && GetAccount();
  }, [WEB3Api.WEB3, Reload]);

  let Transfer = async () => {
    const { WEB3, MyContract } = WEB3Api;
    await MyContract.methods.Transfer().send({
      from: Account,
      value: WEB3.utils.toWei("2", "ether"),
    });

    setReload(!Reload);
  };
  let Withdraw = async () => {
    const { WEB3, MyContract } = WEB3Api;
    await MyContract.methods
      .Withdraw(WEB3.utils.toWei("2", "ether"))
      .send({ from: Account });
    setReload(!Reload);
  };

  let Header = () => {
    return (
      <div
        style={{
          flex: "0.2",
          fontSize: "large",
          fontWeight: "bold",
        }}
        className="Same"
      >
        Funding DApp
      </div>
    );
  };

  let Footer = () => {
    return (
      <div
        style={{
          flex: "0.1",
        }}
        className="Same"
      >
        Made By Zubair With 💛
      </div>
    );
  };
  let Content = () => {
    return (
      <div
        style={{
          flex: 1,
          position: "relative",
          bottom: 0,
          border: "3px dashed white",
        }}
        className="Same"
      >
        <div
          style={{
            display: "inherit",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <p>Balance: {Balance ? Balance + " Ethers" : "Loading ..."}</p>
          <p>Account: {Account ? Account : "Not Connected "} </p>
          <section>
            <button
              className="BTN A"
              onClick={() => {
                let GetAcc = async () => {
                  const Accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                  });
                  console.log(Accounts);
                };
                GetAcc();
              }}
            >
              Connect Metamask
            </button>
            <button className="BTN B" onClick={Transfer}>
              Transfer
            </button>
            <button className="BTN C" onClick={Withdraw}>
              Withdraw
            </button>
          </section>

          <div style={{maxHeight:150,overflow:"scroll",marginTop:20,background:"#27ae60",paddingLeft:10,paddingRight:10,borderRadius:5}} className="Scroll">
            <ul>
              {User &&
                User?.map((Item, Ind) => {
                  return <li key={Ind}>{Item}</li>;
                })}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
        flex: 1,
        height: "97vh",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default App;
