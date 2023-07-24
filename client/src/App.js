import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddresses } from "./constants";
// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [decentralazon, setDecentralazon] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const decentralazonAddress =
      network.chainId in contractAddresses
        ? contractAddresses[network.chainId][0]
        : null;
    const Decentralazon = new ethers.Contract(
      decentralazonAddress,
      abi,
      provider
    );
    setDecentralazon(Decentralazon);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to Decentralazon</h2>
    </div>
  );
}

export default App;
