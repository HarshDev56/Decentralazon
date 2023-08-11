// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

contract Decentralazon {
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string description;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }
    uint256 private s_numberOfProducts = 0;
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

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
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // create a item struct
        uint256 _id = s_numberOfProducts + 1;
        Item memory item = Item(
            _id,
            _name,
            _category,
            _description,
            _image,
            _cost,
            _rating,
            _stock
        );
        // save item struct on blockchain
        items[_id] = item;
        s_numberOfProducts++;
        // Emit event
        emit List(_name, _cost, _stock);
    }

    function buy(uint256 _id) public payable {
        Item memory item = items[_id];

        require(msg.value >= item.cost, "Need to send enough ETH.");

        require(item.stock > 0, "Sorry!! Don't have enough stock");

        Order memory order = Order(block.timestamp, item);

        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        items[_id].stock = item.stock - 1;

        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    function getTotalProduct() public view returns (uint256) {
        return s_numberOfProducts;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "withdraw failed!");
    }
}
