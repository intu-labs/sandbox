import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { IntuProvider } from "@intuweb3/steven-web-kit";
const intuConfig = {
  authProviders: ["google", "twitter"], // List of authentication providers
  isCustomAuth: false, // Flag for using custom authentication
  styles: {
    applicationName: "INTU NFT CLAIM", // Name displayed in the authentication UI
    applicationLogo: "https://intu.xyz/img/INTU_logo.png", // URL for your application logo
    applicationDescription: "Login without a wallet!",
    theme: "dark", // Theme for the authentication UI (e.g., dark or light)
  },
  claimUrl: "https://intudrip.xyz/faucet/claimxfi", // URL for managing user accounts (from environment variable)
  appId: "1:499664624959:web:bf72f54040d3a9c955878a",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntuProvider initialConfig={intuConfig}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </IntuProvider>
);
