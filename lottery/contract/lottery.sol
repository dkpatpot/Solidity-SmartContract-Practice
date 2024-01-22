// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract Lottery{
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function getPlayerArray() public view returns (address payable[] memory){
        return players;
    }

    function enterLottery() public payable {
        require(msg.value > .001 ether);
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    function pickWinner() public restrictedForManager{
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restrictedForManager(){
        require(msg.sender == manager);
        _;
    }
}