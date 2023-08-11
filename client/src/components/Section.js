import React from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";
import { options } from "../constants";

const Section = ({ title, items }) => {
  // Group items by category
  const groupedItems = {};

  items.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <div className="cards__section">
      {Object.keys(groupedItems).map((category, index) => (
        <div id={category} key={index}>
          <h3 id={title}>{category}</h3>
          <hr />

          <div className="cards">
            {groupedItems[category].map((item, itemIndex) => (
              <div key={itemIndex} className="card">
                <div className="card__image">
                  <img src={item.image} alt="Item" />
                </div>
                <div className="card__info">
                  <h4>{item.name}</h4>
                  <Rating value={item.rating} />
                  <p>{ethers.formatUnits(item.cost.toString(), "ether")} ETH</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Section;
