const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const chai = require("chai");
const eventemitter2 = require("chai-eventemitter2");

chai.use(eventemitter2());

const expect = chai.expect;

const tokens = (n) => {
  return ethers.parseEther(n.toString());
};

// Global constants for listing an item...
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Decentralazon", () => {
      let deployer, buyer, decentralazon;
      beforeEach(async () => {
        // setup account
        [deployer, buyer] = await ethers.getSigners();

        const Decentralazon = await ethers.getContractFactory("Decentralazon");
        decentralazon = await Decentralazon.deploy();
      });

      describe("Deployment", () => {
        it("Set the Owner", async () => {
          const owner = await decentralazon.owner();
          expect(deployer.address).to.be.equal(owner);
        });
      });

      describe("Listing", () => {
        let transaction;

        beforeEach(async () => {
          transaction = await decentralazon
            .connect(deployer)
            .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
          await transaction.wait();
        });

        it("Returns item attributes", async () => {
          const item = await decentralazon.items(1);
          expect(Number(item.id)).to.equal(ID);
          expect(item.name).to.equal(NAME);
          expect(item.category).to.equal(CATEGORY);
          expect(item.image).to.equal(IMAGE);
          expect(item.cost).to.equal(COST);
          expect(Number(item.rating)).to.equal(RATING);
          expect(Number(item.stock)).to.equal(STOCK);
        });

        it("emit an List Event", async () => {
          await expect(transaction).to.emit("List");
        });
      });

      describe("Buying", () => {
        let transaction;

        beforeEach(async () => {
          transaction = await decentralazon
            .connect(deployer)
            .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
          await transaction.wait();

          //   Buy item
          transaction = await decentralazon
            .connect(buyer)
            .buy(ID, { value: COST });
          await transaction.wait();
        });

        it("Update the contract balance", async () => {
          const result = await ethers.provider.getBalance(decentralazon);
          expect(result).to.equal(COST);
        });

        it("Update the Buyer's order count", async () => {
          const result = await decentralazon.orderCount(buyer.address);
          expect(Number(result)).to.equal(1);
        });

        it("Adds the Order", async () => {
          const order = await decentralazon.orders(buyer.address, 1);
          expect(Number(order.time)).to.be.greaterThan(0);
          expect(order.item.name).to.equal(NAME);
        });

        it("Update the contract balance", async () => {
          const result = await ethers.provider.getBalance(decentralazon);
          expect(result).to.equal(COST);
        });

        it("emit an Buy Event", async () => {
          await expect(transaction).to.emit("Buy");
        });
      });

      describe("Withdraw", () => {
        let transaction, balanceBefore;

        beforeEach(async () => {
          // Add product
          transaction = await decentralazon
            .connect(deployer)
            .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
          await transaction.wait();

          //   Buy item
          transaction = await decentralazon
            .connect(buyer)
            .buy(ID, { value: COST });
          await transaction.wait();

          // balance of the deployer before the withdraw
          balanceBefore = await ethers.provider.getBalance(deployer);

          // withdraw
          transaction = await decentralazon.connect(deployer).withdraw();
          await transaction.wait();
        });

        it("update the owner's balance", async () => {
          const balanceAfter = await ethers.provider.getBalance(deployer);
          expect(Number(balanceAfter)).to.be.greaterThan(Number(balanceBefore));
        });
        it("update the contract's balance", async () => {
          const contractBalance = await ethers.provider.getBalance(
            decentralazon
          );
          expect(Number(contractBalance)).to.equal(0);
        });
      });
    });
