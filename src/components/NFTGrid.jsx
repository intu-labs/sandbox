import { SimpleGrid } from "@chakra-ui/react";
import NFTCard from "./NFTCard";
import { useNFT } from "../hooks/useNFT";
import { provider } from "../config/constants";
export const NFTGrid = ({
  onSubmitTx,
  currentVault,
  currentVaultEoa,
  creatingAccount,
  gatheringVaults,
}) => {
  const { nftData } = useNFT(provider);

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
          isClaimed={item.claimed}
        />
      ))}
    </SimpleGrid>
  );
};
