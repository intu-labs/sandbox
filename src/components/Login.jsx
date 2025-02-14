import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export const LoginButton = ({
  intuConnect,
  isIntuConnected,
  intuDisconnect,
  isCreatingIntuAccount,
}) => {
  const connectHandler = async () => {
    await intuConnect(); // Call the connect method to initiate the login process
  };

  useEffect(() => {
    // Only set the timer if not already connected
    const timer = !isIntuConnected
      ? setTimeout(() => {
          connectHandler();
        }, 1000)
      : null; // Don't create timer if already connected

    return () => {
      if (timer) clearTimeout(timer); // Only clear if timer exists
    };
  }, []); // Empty dependency array since we only want this on mount

  return (
    <div>
      {isIntuConnected ? (
        <div style={{ float: "right" }}>
          {!isCreatingIntuAccount ? (
            <Button colorScheme="red" size="md" onClick={intuDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Box>
              <Spinner /> : <Text>Creating Account</Text>
            </Box>
          )}
        </div>
      ) : (
        <VStack>
          <Button colorScheme="purple" size="lg" onClick={connectHandler}>
            INTU Connect
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => {
              connectHandler();
            }}
          >
            Recover Account
          </Button>
        </VStack>
      )}
    </div>
  );
};
