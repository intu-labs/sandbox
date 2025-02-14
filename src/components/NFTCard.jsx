import { Box, Image, VStack, Text, Button } from "@chakra-ui/react";
import { DATA_BUMP } from "../config/constants";

const NFTCard = ({
  item,
  index,
  onSubmitTx,
  currentVault,
  currentVaultEoa,
  creatingAccount,
  gatheringVaults,
  isClaimed,
}) => (
  <Box
    key={index}
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    backdropFilter="blur(20px)"
    bg="rgba(255, 255, 255, 0.7)"
    isDisabled={isClaimed}
  >
    <Image
      src={item.image}
      alt={item.name}
      objectFit="cover"
      height="200px"
      width="100%"
    />
    <VStack p={4} align="start">
      <Text fontWeight="bold">NFT #{index + DATA_BUMP}</Text>
      <Text fontSize="sm" color="gray.500">
        Created: {item.date}
      </Text>
      {!creatingAccount && !gatheringVaults ? (
        <Button
          isDisabled={isClaimed}
          bg={isClaimed ? "red.300" : "blue.300"}
          color="white"
          onClick={() =>
            onSubmitTx(currentVault, currentVaultEoa, index + DATA_BUMP)
          }
        >
          {!isClaimed ? "CLAIM NFT" : "Claimed"}
        </Button>
      ) : (
        <Button isDisabled={true} isLoading={true}>
          ... Busy ...
        </Button>
      )}
    </VStack>
  </Box>
);

export default NFTCard;
