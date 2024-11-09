import { Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
export const FloatingInfoBox = async ({
  isCreatingIntuAccount,
  getIntuAccount,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <></>;
  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      bg="blue.50"
      boxShadow="lg"
      borderRadius="md"
      p={4}
      maxWidth="300px"
      zIndex={999}
      bgColor="#f62681"
    >
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => setIsVisible(false)}
      />

      <VStack align="start" spacing={2}>
        <Text fontWeight="bold">Info:</Text>
        {isCreatingIntuAccount() && (
          <Text>
            Creating INTU account.
            <br />
            Generating your address
          </Text>
        )}
        {getIntuAccount() && (
          <Text>
            <a href={`https://sepolia.arbiscan.io/address/${currentVaultEoa}`}>
              {`${currentVaultEoa.slice(0, 6)}...${currentVaultEoa.slice(-4)}`}
            </a>
          </Text>
        )}
      </VStack>
    </Box>
  );
};
