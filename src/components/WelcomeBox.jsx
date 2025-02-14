import { Box, Text, Button } from "@chakra-ui/react";
import { RotatingText } from "./RotatingText";
import { LoginButton } from "./Login";

export const WelcomeBox = ({ 
  connectIntu, 
  isIntuConnected, 
  disconnectIntu, 
  isCreatingIntuAccount 
}) => (
  <Box
    bg="rgba(200, 200, 200, 0.7)"
    backdropFilter="blur(20px)"
    borderRadius="md"
    p={6}
    boxShadow="md"
  >
    <RotatingText />
    <br />
    <Text color="black" fontSize="xl">
      No wallet/gas/Web3-ness needed.
    </Text>
    <LoginButton
      intuConnect={connectIntu}
      isIntuConnected={isIntuConnected}
      intuDisconnect={disconnectIntu}
      isCreatingIntuAccount={isCreatingIntuAccount}
    />
  </Box>
); 