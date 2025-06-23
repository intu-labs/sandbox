import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { IntuProvider } from "@intuweb3/web-kit";
import { IS_XFI, IS_ETHERLINK } from "./config/constants";

const intuConfig = {
  authProviders: ["google", "twitter", "apple"],
  isCustomAuth: false,
  styles: {
    applicationName: IS_XFI
      ? "CROSSFI NFT CLAIM"
      : IS_ETHERLINK
      ? "ETHERLINK NFT CLAIM"
      : "ARBITRUM NFT CLAIM",
    applicationLogo: IS_XFI
      ? "https://cryptototem.com/wp-content/uploads/2024/02/CrossFi-logo.jpg"
      : IS_ETHERLINK
      ? "https://miro.medium.com/v2/resize:fill:88:88/1*So8Iso6Q1UFbmyISstUGLA.jpeg"
      : "https://altcoinsbox.com/wp-content/uploads/2023/03/arbitrum-logo-300x300.webp",
    applicationDescription: IS_XFI
      ? "No wallet needed!"
      : IS_ETHERLINK
      ? "No wallet needed!"
      : "No wallet needed!",
    theme: "dark",
  },
  claimUrl: IS_XFI
    ? "https://intudrip.xyz/faucet/claimxfi"
    : IS_ETHERLINK
    ? "https://intudrip.xyz/faucet/claimetherlink"
    : "https://intudrip.xyz/faucet/claimarbitrumsepolia",
  appId: "1:499664624959:web:bf72f54040d3a9c955878a",
  nodeSigner1: 0x7d8a43adf7293cfe98cf3680adec6e2bf0351587,
  nodeSigner2: 0xc29cd9ff0460b9c9bbc4b410eb175512431bb5b7,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntuProvider initialConfig={intuConfig}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </IntuProvider>
);
