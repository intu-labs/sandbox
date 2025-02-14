import { SimpleGrid } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NFTCard from "./NFTCard";
import { getClaimStatusForNFTs } from "./Nft";

export const NFTGrid = ({
  nftData,
  onSubmitTx,
  currentVault,
  currentVaultEoa,
  creatingAccount,
  gatheringVaults,
  nftContract,
}) => {
  const [claimStatuses, setClaimStatuses] = useState([]);

  useEffect(() => {
    const fetchClaimStatuses = async () => {
      const statuses = await getClaimStatusForNFTs(nftContract, nftData.length);
      setClaimStatuses(statuses);
    };

    if (nftContract) {
      fetchClaimStatuses();
    }
  }, [nftContract, nftData]);

  return (
    <SimpleGrid
      columns={[1, 2, 3, 4]}
      spacing={6}
      px={4}
      backdropFilter="blur(10px)"
      bg="rgba(1, 1, 1, 0.4)"
      padding="50px"
    >
      {nftData.map((item, index) => (
        <NFTCard
          key={index}
          item={item}
          index={index}
          onSubmitTx={onSubmitTx}
          currentVault={currentVault}
          currentVaultEoa={currentVaultEoa}
          creatingAccount={creatingAccount}
          gatheringVaults={gatheringVaults}
          isClaimed={claimStatuses[index]}
        />
      ))}
    </SimpleGrid>
  );
};
