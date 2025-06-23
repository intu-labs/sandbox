import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { getClaimStatusForNFTs } from "../components/Nft";
import {
  NFT_CONTRACT_ADDRESS_ARBITRUM_ONE,
  NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
  NFT_CONTRACT_ADDRESS_XFI,
  NFT_CONTRACT_ADDRESS_ETHERLINK,
  IS_XFI,
  IS_MAINNET,
  IS_ETHERLINK,
  TOTAL_TOKENS,
  DATA_BUMP
} from "../config/constants";
import NFTJSON from "../1155.json";

export const useNFT = (provider) => {
  const [claimStatuses, setClaimStatuses] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Only create the contract if provider exists
  const getNFTContract = () => {
    if (!provider) {
      console.warn("Provider not available yet");
      return null;
    }

    const nftContractAddress = IS_XFI
      ? NFT_CONTRACT_ADDRESS_XFI
      : IS_ETHERLINK
        ? NFT_CONTRACT_ADDRESS_ETHERLINK
        : IS_MAINNET
          ? NFT_CONTRACT_ADDRESS_ARBITRUM_ONE
          : NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA;

    try {
      return new ethers.Contract(nftContractAddress, NFTJSON, provider);
    } catch (err) {
      console.error("Error creating NFT contract instance:", err);
      return null;
    }
  };

  // Effect for fetching claim statuses - depends on provider
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!provider) {
        console.log("Provider not available, skipping NFT data fetch");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contract = getNFTContract();
        if (!contract) {
          throw new Error("Failed to initialize NFT contract");
        }

        const nftClaimStatusArray = await getClaimStatusForNFTs(
          contract,
          TOTAL_TOKENS
        );

        if (isMounted) {
          setClaimStatuses(nftClaimStatusArray);
          const data = Array(TOTAL_TOKENS)
            .fill()
            .map((_, i) => ({
              image: `https://tan-legislative-peafowl-782.mypinata.cloud/ipfs/QmQEWNsT93yZWK5GqZQpDavVYf3Bw14hbgGuXzvxtwosfx/${i + DATA_BUMP}.png`,
              name: `Item ${i + DATA_BUMP}`,
              date: new Date(
                Date.now() - Math.floor(Math.random() * 1000000000)
              ).toLocaleDateString(),
              claimed: nftClaimStatusArray[i] || false,
            }));

          setNftData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching NFT data:", err);
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [provider]); // Only dependency should be provider

  return {
    nftData,
    claimStatuses,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      const contract = getNFTContract();
      if (contract) {
        getClaimStatusForNFTs(contract, TOTAL_TOKENS)
          .then(result => {
            const processedArray = result.slice(1);
            setClaimStatuses(processedArray);

            setNftData(prev =>
              prev.map((item, i) => ({
                ...item,
                claimed: processedArray[i] || false
              }))
            );
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Error in refetch:", err);
            setError(err.message);
            setIsLoading(false);
          });
      } else {
        setError("Provider or contract not available");
        setIsLoading(false);
      }
    }
  };
};