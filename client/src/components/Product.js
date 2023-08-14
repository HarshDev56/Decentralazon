import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";
import close from "../assets/close.svg";

const Product = ({
  clickedItem,
  provider,
  account,
  decentralazon,
  toggleProduct,
}) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const events = await decentralazon.queryFilter("Buy");
    const orders = events.filter(
      (event) =>
        event.args.buyer === account &&
        event.args.itemId.toString() === clickedItem.id.toString()
    );

    if (orders.length === 0) return;

    const order = await decentralazon.orders(account, orders[0].args.orderId);
    setOrder(order);
  };

  const buyHandler = async () => {
    const signer = await provider.getSigner();
    const transaction = await decentralazon
      .connect(signer)
      .buy(clickedItem.id, { value: clickedItem.cost });
    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();
  }, [hasBought]);

  return (
    <div className="product ">
      <div className="product__details w-full  flex flex-col gap-[30px] overflow-y-auto h-full">
        <div className="product__image">
          <img src={clickedItem.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{clickedItem.name}</h1>

          <Rating value={clickedItem.rating} />

          <hr />

          <p>{clickedItem.address}</p>

          <h2>
            {ethers.formatUnits(clickedItem.cost.toString(), "ether")} ETH
          </h2>

          <hr />

          <h2>Overview</h2>

          <p>{clickedItem.description}</p>
        </div>
        <div className="product__order">
          <h1>
            {ethers.formatUnits(clickedItem.cost.toString(), "ether")} ETH
          </h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>

          {clickedItem.stock > 0 ? (
            <p>{`In Stock.(${clickedItem.stock} available)`}</p>
          ) : (
            <p>Out of Stock.</p>
          )}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>

          <p>
            <small>Ships from</small> Decentralazon
          </p>
          <p>
            <small>Sold by</small> Decentralazon
          </p>
          {order && (
            <div className="product__bought">
              Item bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + "000")
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          )}
        </div>

        <button onClick={toggleProduct} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Product;
