const HDWalletProvider = require("@truffle/hdwallet-provider");
const {Web3} = require('web3');
const compiledFile = require('./compile')
const interface = compiledFile.abi;
const bytecode = compiledFile.evm.bytecode.object;
const provider = new HDWalletProvider(
  "trap fury debate relax payment flee sweet crawl stomach business vanish own",
  "https://rpc.sonic.fantom.network/"
);
const web3 = new Web3(provider);

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  console.log("Attemping to deploy", accounts[0]);
  const inbox = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: accounts[0],gas: "1000000" });
  console.log('Contract deployed to',inbox.options.address);
  provider.engine.stop();
};
deploy();
