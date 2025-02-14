//async function isNFTClaimed(nftContract, tokenId) {
//  try {
//    const claimed = await nftContract.ownerOf(tokenId);
//    return true;
//  } catch (error) {
//    return false; //placeholder
//  }
//}

async function hasBeenClaimed(nftContract, tokenId) {
  try {
    const claimed = await nftContract.hasNFTBeenClaimed(tokenId);
    return claimed;
  } catch (error) {
    return false; //placeholder
  }
}

export async function getClaimStatusForNFTs(nftContract, tokenIds) {
  try {
    const numberArray = Array.from({ length: tokenIds }, (_, i) => i);
    const claimPromises = numberArray.map((id) =>
      nftContract.hasNFTBeenClaimed(id + 1)
    );
    const claimStatuses = await Promise.all(claimPromises);
    return claimStatuses;
  } catch (error) {
    console.error("Error checking NFT claim status:", error);
    return Array(tokenIds).fill(false); // Return array of false values in case of error
  }
}

