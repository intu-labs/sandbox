import { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
import { IS_XFI, IS_ETHERLINK } from "../config/constants";

export const RotatingText = () => {
  const [index, setIndex] = useState(0);

  const texts = [
    "GAME",
    "DAPP",
    "DEFI",
    "PORTAL",
    "CASINO",
    "SOCIAL",
    "ART",
    "NFT",
    "WHATEVER",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <Text color="black" fontSize="2xl" style={{ fontWeight: "bold" }}>
      Welcome to this {IS_ETHERLINK ? "Etherlink" : IS_XFI ? "XFI" : "Web3"}:{" "}
      <br />
      {texts[index]}
    </Text>
  );
};
