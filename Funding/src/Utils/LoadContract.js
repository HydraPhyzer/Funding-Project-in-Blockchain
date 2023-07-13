// import contract from "@truffle/contract";
import Web3 from "web3";
export let LoadContract = async (Name, Provider) => {
  //This Method is Using Truffle

  // const Res = await fetch(`./Contracts/${Name}.json`);
  // const ABI = await Res.json();
  // const MyContract = contract(ABI);
  // MyContract.setProvider(Provider);
  // let Instance = await MyContract.deployed();
  // return Instance;

  const Res = await fetch(`./Contracts/${Name}.json`);
  const ABI = await Res.json();
  const ContractABI=ABI.abi;
  const ContractAddress=ABI.networks[5777].address;
  const WEB3 = new Web3(Provider);
  const MyContract = new WEB3.eth.Contract(ContractABI,ContractAddress);
  return MyContract;
};
