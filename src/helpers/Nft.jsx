async function isNFTClaimed(nftContract, tokenId) {
  try {
    const claimed = await nftContract.ownerOf(tokenId);
    return true;
  } catch (error) {
    return false; //placeholder
  }
}

export async function getClaimStatusForNFTs(nftContract, tokenIds) {
  const numberArray = Array.from({ length: tokenIds }, (_, i) => i);
  const claimPromises = numberArray.map((id) => isNFTClaimed(nftContract, id));
  const claimStatuses = await Promise.all(claimPromises);
  return numberArray.reduce((acc, id, index) => {
    acc[id] = claimStatuses[index];
    return acc;
  }, []);
}
