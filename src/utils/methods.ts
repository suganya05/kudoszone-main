import {
  AUCTION_CONTRACT_ADDRESS,
  AUCTION_ERC1155_CONTRACT_ADDRESS,
  MINT_CONTRACT_ADDRESS,
  MINT_ERC1155_CONTRACT_ADDRESS,
} from "./address";
import { loadNft1155Contract, loadNftContract } from "./loadContract";

export const getApproveNFT = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc721TokenAddress: string,
) => {
  const mintContract = loadNftContract(address, provider, erc721TokenAddress);
  const value = await mintContract.isApprovedForAll(
    address,
    AUCTION_CONTRACT_ADDRESS[chainId],
  );
  return value;
};

export const getApproveNFTerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc1155TokenAddress: string,
) => {
  const mintContract = loadNft1155Contract(
    address,
    provider,
    erc1155TokenAddress,
  );
  const value = await mintContract.isApprovedForAll(
    address,
    AUCTION_ERC1155_CONTRACT_ADDRESS[chainId],
  );
  return value;
};

export const ApproveNFT = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc721TokenAddress: string,
) => {
  console.log(erc721TokenAddress);
  const mintContract = loadNftContract(address, provider, erc721TokenAddress);
  const tx = await mintContract.setApprovalForAll(
    AUCTION_CONTRACT_ADDRESS[chainId],
    true,
  );
  await tx.wait();
};

export const ApproveNFTerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc1155TokenAddress: string,
) => {
  const mintContract = loadNft1155Contract(
    address,
    provider,
    erc1155TokenAddress,
  );
  const tx = await mintContract.setApprovalForAll(
    AUCTION_ERC1155_CONTRACT_ADDRESS[chainId],
    true,
  );
  await tx.wait();
};

export const createCollectible = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenuri: string,
  fee: number | string,
) => {
  const mintContract = loadNftContract(
    address,
    provider,
    MINT_CONTRACT_ADDRESS[chainId],
  );
  const tx = await mintContract.createCollectible(tokenuri, fee);
  await tx.wait();
};

export const createCollectible1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenuri: string,
  supply: number,
  fee: number | string,
) => {
  console.log("mul");
  const mintContract = loadNft1155Contract(
    address,
    provider,
    MINT_ERC1155_CONTRACT_ADDRESS[chainId],
  );
  const tx = await mintContract.mint(tokenuri, supply, fee);
  await tx.wait();
};
