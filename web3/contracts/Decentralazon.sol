// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

contract Decentralazon {
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only Owner is allowed to Call this function"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // create a item struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        // save item struct on blockchain
        items[_id] = item;

        // Emit event
        emit List(_name, _cost, _stock);
    }

    function buy(uint256 _id) public payable {
        Item memory item = items[_id];

        Order memory order = Order(block.timestamp, item);

        orderCount[msg.sender]++;
    }
}
