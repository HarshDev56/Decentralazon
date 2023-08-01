import { ethers } from "ethers";
import { options } from "../constants";
const Navigation = ({ account, setAccount, owner, onUploadClick }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };
  return (
    <nav>
      <div className="nav__brand">
        <h1>Decentralazon</h1>
      </div>
      <input type="text" className="nav__search" />

      {account ? (
        <button type="Button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="Button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
      {owner && (
        <button type="Button" className="nav__connect" onClick={onUploadClick}>
          Upload
        </button>
      )}

      <ul className="nav__links">
        {options.map((e) => (
          <li>
            <a href={`#${e.label}`}>{e.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
