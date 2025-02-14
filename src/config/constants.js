import { ethers } from "ethers";
import NFTJSON from "../1155.json";

export const NFT_CONTRACT_ADDRESS_ARBITRUM = "0x44b9cebcd95671efc5d2a3f82e1d35fdf92a2dd7";
export const NFT_CONTRACT_ADDRESS_XFI = "0xfed48a7818a4131e2fddd60a120c5d0294bf2628";
//0x990B0475E7edb2a74226D2301ce1e4e967dC76ef

export const BLOCK_RANGE = 250000;
export const SLEEP_TIME = 1500;
export const DATA_BUMP = 1;
export const TOTAL_TOKENS = 44; 

export const IS_XFI = false;

export const ARBITRUM_RPC =
  "https://arb-sepolia.g.alchemy.com/v2/5ct6vPewvXw92aqUrKtzjYbN7hVXVui-";
export const XFI_RPC =
  "https://crossfi-testnet.g.alchemy.com/v2/V_naIVlu3JC0RVPvW4aPar2y-lEsnsLj";

  export const erc721Interface = new ethers.utils.Interface([
    "function safeMint(address _to, uint _tokenId)",
  ]);
  
  export const erc1155Interface = new ethers.utils.Interface([
    "function claimNFT(uint256 _tokenId)",
    "function hasNFTBeenClaimed(uint256 _tokenId) view returns (bool)",
  ]);

  
export const provider = new ethers.providers.StaticJsonRpcProvider(
  IS_XFI ? XFI_RPC : ARBITRUM_RPC
);


export const NFT_CONTRACT = new ethers.Contract(
  IS_XFI ? NFT_CONTRACT_ADDRESS_XFI : NFT_CONTRACT_ADDRESS_ARBITRUM,
  NFTJSON,
  provider
);


