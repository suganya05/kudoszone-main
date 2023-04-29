import { loadNft1155Contract, loadNftContract } from "./loadContract";
import { getIpfsData } from "./marketplacemethods";

export const getOwnerOfNft = async (
  address: string,
  provider,
  tokenAddress: string,
  tokenId: string | number,
) => {
  const nftContract = loadNftContract(address, provider, tokenAddress);
  return await nftContract.ownerOf(tokenId);
};

export const getOwnerOfNftErc1155 = async (
  address: string,
  provider,
  tokenAddress: string,
  tokenId: string | number,
) => {
  const nftContract = loadNft1155Contract(address, provider, tokenAddress);
  return await nftContract.getCreator(tokenId);
};

export const getMetadataOfTokenId = async (
  address: string,
  provider,
  tokenAddress: string,
  tokenId: string | number,
  Cloud: any,
) => {
  const nftContract = loadNftContract(address, provider, tokenAddress);
  const tokenURI = await nftContract.tokenURI(tokenId);
  const ipfsData = await getIpfsData(Cloud, tokenURI);

  return ipfsData;
};
