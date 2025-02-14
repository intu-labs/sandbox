import { useState, useEffect } from "react";
import { getClaimStatusForNFTs } from "../components/Nft";
import { NFT_CONTRACT, TOTAL_TOKENS, DATA_BUMP } from "../config/constants";

export const useNFT = () => {
  const [claimStatuses, setClaimStatuses] = useState([]);
  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let nftClaimStatusArray = await getClaimStatusForNFTs(
        NFT_CONTRACT,
        TOTAL_TOKENS
      );
      nftClaimStatusArray.shift();
      setClaimStatuses(nftClaimStatusArray);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const data = Array(TOTAL_TOKENS)
      .fill()
      .map((item, i) => ({
        image: `https://tan-legislative-peafowl-782.mypinata.cloud/ipfs/QmQEWNsT93yZWK5GqZQpDavVYf3Bw14hbgGuXzvxtwosfx/${
          i + DATA_BUMP
        }.png`,
        name: `Item ${i + DATA_BUMP}`,
        date: new Date(
          Date.now() - Math.floor(Math.random() * 1000000000)
        ).toLocaleDateString(),
        claimed: claimStatuses[i],
      }));
    setNftData(data);
  }, [claimStatuses]);

  return { nftData, claimStatuses };
}; 