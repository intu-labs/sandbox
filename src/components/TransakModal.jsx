import React, { useEffect } from "react";

const TransakModal = ({ apiKey, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const transak = new window.TransakSDK({
        apiKey: "99a7a0e0-839b-41f7-8905-97db358b15f0", // Your API Key
        environment: "STAGING", // STAGING/PRODUCTION
        defaultCryptoCurrency: "ETH",
        walletAddress: "0xF21A6C1BaD49Df0Dd9D52710dd60D35C2D29DA43", // Your customer's wallet address
        themeColor: "000000", // App theme color
        fiatCurrency: "", // INR/GBP
        email: "", // Your customer's email address
        redirectURL: "",
        hostURL: window.location.origin,
        widgetHeight: "550px",
        widgetWidth: "450px",
      });

      transak.init();

      transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data);
      });

      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        onClose();
        transak.close();
      });
    }
  }, [isOpen, apiKey, onClose]);

  return null;
};

export default TransakModal;
