import { Box, Button, Spinner, Text } from "@chakra-ui/react";

export const LoginButton = ({
  connectIntu,
  isIntuConnected,
  disconnectIntu,
  isCreatingIntuAccount,
}) => {
  const connectHandler = async () => {
    await connectIntu(); // Call the connect method to initiate the login process
  };
  return (
    <div>
      {isIntuConnected ? (
        <div style={{ float: "right" }}>
          {!isCreatingIntuAccount ? (
            <Button colorScheme="red" size="md" onClick={disconnectIntu}>
              Disconnect
            </Button>
          ) : (
            <Box>
              <Spinner /> : <Text>Creating Account</Text>
            </Box>
          )}
        </div>
      ) : (
        <Button colorScheme="purple" size="lg" onClick={connectHandler}>
          INTU Connect
        </Button>
      )}
    </div>
  );
};
