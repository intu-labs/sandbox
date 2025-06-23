import { Box, Heading } from "@chakra-ui/react";
import { IS_XFI, IS_ETHERLINK } from "../config/constants";

export const PageHeader = () => (
  <Box backdropFilter="blur(10px)" bg="rgba(1, 1, 1, 0.4)">
    <Heading as="h2" size="lg" color="white">
      <br />
      Get started with {IS_ETHERLINK ? "Etherlink" : IS_XFI ? "XFI" : "Web3"}!
      Claim an NFT! 🚀
    </Heading>
  </Box>
);
