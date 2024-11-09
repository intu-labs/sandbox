import { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <Text color="black" fontSize="2xl" style={{ fontWeight: "bold" }}>
      Welcome to this Web3: <br />
      {texts[index]}
    </Text>
  );
};
