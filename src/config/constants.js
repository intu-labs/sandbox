import { ethers } from "ethers";
import NFTJSON from "../1155.json";

export const NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA = "0x2664f941862ef51f4522d9f6e592faa474fe9458";
export const NFT_CONTRACT_ADDRESS_XFI = "0xba4f47869d26b21f8af337f013636a9657785620";
export const NFT_CONTRACT_ADDRESS_ARBITRUM_ONE = "0x79f79b0b02f00d29563e5a1a07e781e5de87ae07";
export const NFT_CONTRACT_ADDRESS_ETHERLINK = "0x1f4ad01a01a032c0180671349c011e5a6c150858";

//0x990B0475E7edb2a74226D2301ce1e4e967dC76ef

export const BLOCK_RANGE = 250000;
export const SLEEP_TIME = 2000;
export const DATA_BUMP = 1;
export const TOTAL_TOKENS = 44;
export const IS_XFI = false;
export const IS_MAINNET = false;
export const IS_ETHERLINK = false;

export const ARBITRUM_SEPOLIA_RPC =
  "https://arb-sepolia.g.alchemy.com/v2/5ct6vPewvXw92aqUrKtzjYbN7hVXVui-";
export const ARBITRUM_ONE_RPC =
  "https://arb-mainnet.g.alchemy.com/v2/5ct6vPewvXw92aqUrKtzjYbN7hVXVui-";
export const XFI_RPC =
  "https://crossfi-testnet.g.alchemy.com/v2/V_naIVlu3JC0RVPvW4aPar2y-lEsnsLj";
export const ETHERLINK_RPC =
  "https://rpc.intu.xyz/";

export const erc721Interface = new ethers.utils.Interface([
  "function safeMint(address _to, uint _tokenId)",
]);

export const erc1155Interface = new ethers.utils.Interface([
  "function claimNFT(uint256 _tokenId)",
  "function hasNFTBeenClaimed(uint256 _tokenId) view returns (bool)",
]);

export const provider = new ethers.providers.StaticJsonRpcProvider(
  IS_XFI ? XFI_RPC : IS_ETHERLINK ? ETHERLINK_RPC : IS_MAINNET ? ARBITRUM_ONE_RPC : ARBITRUM_SEPOLIA_RPC
);

export const ETHERLINK_CLAIM_URL = "https://intudrip.xyz/faucet/claimetherlink";

//export const NFT_CONTRACT = new ethers.Contract(
//  "0xb3775fb10c048c324d64752a788c72e4baef99b4",
//  NFTJSON,
//  provider
//);

export const getNetworkFromChainId = (chainId) => {
  switch (chainId) {
    case 4157:
      return "xfi-sepolia";
    case 421614:
      return "arbitrum-sepolia";
    case 42161:
      return "arbitrum-one";
    case 42793:
      return "etherlink";
    default:
      return "arbitrum-one";
  }
};


