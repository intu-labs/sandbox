import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { LoginButton } from "./Login";

export const FloatingInfoBox = ({
  isIntuConnected,
  isCreatingIntuAccount,
  currentVaultEoa,
  connectIntu,
  disconnectIntu,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;
  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      bgGradient="linear(to-br, gray.100, gray.400)"
      boxShadow="xl"
      borderRadius="md"
      p={4}
      maxWidth="300px"
      zIndex={999}
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
          <>
            <Text>
              Creating INTU account.
              <br />
              Generating your address, please be patient.
              <video width="100%" controls>
                <source src="/public/CROSSFI_1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Text>
          </>
        )}
        {isIntuConnected() && (
          <>
            <Text>
              <a
                href={`https://sepolia.arbiscan.io/address/${currentVaultEoa}`}
              >
                {`${currentVaultEoa.slice(0, 6)}...${currentVaultEoa.slice(
                  -4
                )}`}
              </a>
            </Text>
            <video width="100%" controls>
              <source src="../public/CROSSFI_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </>
        )}
      </VStack>
    </Box>
  );
};
