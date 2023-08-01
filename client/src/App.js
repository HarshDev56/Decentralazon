import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddresses } from "./constants";
// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";
import UploadProduct from "./components/UploadProduct";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [decentralazon, setDecentralazon] = useState(null);
  const [owner, setOwner] = useState(null);
  const [upload, setUpload] = useState(false);

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
    const owner = await Decentralazon.owner();
    setOwner(owner);
  };
  const handleUploadClick = () => {
    setUpload(true);
  };
  const toggleUpload = () => {
    upload ? setUpload(false) : setUpload(true);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation
        account={account}
        setAccount={setAccount}
        owner={owner}
        onUploadClick={handleUploadClick}
      />
      <h2>Welcome to Decentralazon</h2>
      {upload && (
        <UploadProduct
          toggleUpload={toggleUpload}
          decentralazon={decentralazon}
          provider={provider}
        />
      )}
    </div>
  );
}

export default App;
