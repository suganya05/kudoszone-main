import { ethers } from "ethers";
import {
  AUCTION_CONTRACT_ADDRESS,
  AUCTION_ERC1155_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
} from "./address";
import tokenabijson from "./abi/token.json";
import mintabi from "./abi/mint.json";
import minterc1155 from "./abi/mint1155.json";
import marketplaceabi from "./abi/marketplace.json";
import marketplace1155abi from "./abi/marketplaceerc1155.json";
import stakingabi from "./abi/staking.json";

export const loadTokenContract = (
  address: string,
  provider: any,
  tokenaddress,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const nftContract = new ethers.Contract(tokenaddress, tokenabijson, signer);
  return nftContract;
};

export const loadMarketplaceContract = (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const nftContract = new ethers.Contract(
    AUCTION_CONTRACT_ADDRESS[chainId],
    marketplaceabi,
    signer,
  );
  return nftContract;
};

export const loadMarketplace1155Contract = (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const nftContract = new ethers.Contract(
    AUCTION_ERC1155_CONTRACT_ADDRESS[chainId],
    marketplace1155abi,
    signer,
  );
  return nftContract;
};

export const loadNftContract = (
  address: string,
  provider: any,
  erc721TokenAddress: string,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const nftContract = new ethers.Contract(erc721TokenAddress, mintabi, signer);
  return nftContract;
};

export const loadNft1155Contract = (
  address: string,
  provider: any,
  erc1155TokenAddress: string,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const nftContract = new ethers.Contract(
    erc1155TokenAddress,
    minterc1155,
    signer,
  );
  return nftContract;
};

export const loadStakingContract = (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const etherProvider = new ethers.providers.Web3Provider(provider);
  const signer = etherProvider.getSigner(address);
  const stakingContract = new ethers.Contract(
    STAKING_CONTRACT_ADDRESS[chainId],
    stakingabi,
    signer,
  );
  return stakingContract;
};
