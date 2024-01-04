const {Web3} = require('web3');
const ganache = require('ganache');
const assert = require('assert');

// Use lowercase 'web3' as it is not a class and doesn't require instantiation
const web3 = new Web3(ganache.provider());

// Import the contract's compiled interface and bytecode
const compiledFile = require("../inbox/compile");
const interface = compiledFile.abi;
const bytecode = compiledFile.evm.bytecode.object;

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode, arguments: ['Hi there'] })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('All accounts', () => {
        console.log(accounts);
    });
    it('Deploy a contract!', () => {
        assert.ok(inbox.options.address);
    });
    it('Has a default message',async ()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message,'Hi there')
    });
    it('Can chage the message',async ()=>{
        await inbox.methods.setMessage('bye').send({from:accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message,'bye')
    })
});


//Example of mocha test
// class Car{
//     park(){
//         return 'stopped';
//     }
//     drive(){
//         return 'vroom';
//     }
// }
// let car;
// beforeEach(()=>{
//     car = new Car();
// });
// describe('Park',()=>{
//     it('can park',()=>{
//         assert.equal(car.park(),'stopped');
//     })
//     it('can drive',()=>{
//         assert.equal(car.drive(),'vroom');
//     })
// })