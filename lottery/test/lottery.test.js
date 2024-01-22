const { Web3 } = require("web3");
const ganache = require("ganache");
const assert = require("assert");

const web3 = new Web3(ganache.provider());
const compiledFile = require("../compile");
const interface = compiledFile.abi;
const bytecode = compiledFile.evm.bytecode.object;

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe('Lottery Contract',() =>{
    it('Deploy a contract!', () => {
        assert.ok(lottery.options.address);
    });
    it('Allows one account to enter lottery',async () =>{
        await lottery.methods.enterLottery().send({from:accounts[0],value:web3.utils.toWei('0.02','ether')});
        const players = await lottery.methods.getPlayerArray().call({from:accounts[0]});
        console.log(players);
        assert.equal(players[0],accounts[0]);
        assert.equal(1,players.length);
    });
    it('Allows multiple account to enter lottery',async () =>{
        await lottery.methods.enterLottery().send({from:accounts[0],value:web3.utils.toWei('0.02','ether')});
        await lottery.methods.enterLottery().send({from:accounts[1],value:web3.utils.toWei('0.02','ether')});
        await lottery.methods.enterLottery().send({from:accounts[2],value:web3.utils.toWei('0.02','ether')});
        const players = await lottery.methods.getPlayerArray().call({from:accounts[0]});
        console.log(players);
        assert.equal(players[0],accounts[0]);
        assert.equal(players[1],accounts[1]);
        assert.equal(players[2],accounts[2]);
        assert.equal(3,players.length);
    });
    it('Requires a minimum amount of ether',async () => {
        try {
            await lottery.methods.enterLottery().send({from:accounts[0],value:'0'});
            assert(false)
        } catch (error) {
            assert(error);
        }
    });
    it('Only manager can call pickWinner()',async () => {
        try {
            await lottery.methods.pickWinner().send({from:accounts[1]});
            assert(false)
        } catch (error) {
            assert(error);
        }
    });
    it('Sends ETH to the winner and reset the players array',async () =>{
        await lottery.methods.enterLottery().send({from:accounts[0],value:web3.utils.toWei('2','ether')});
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from:accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference>web3.utils.toWei('1.99','ether'));
    })
});