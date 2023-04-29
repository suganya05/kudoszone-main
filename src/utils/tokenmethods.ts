import { NETWORK } from "constants/index";
import { formatEther } from "helpers/formatters";
import {
  AUCTION_CONTRACT_ADDRESS,
  AUCTION_ERC1155_CONTRACT_ADDRESS,
  TOKEN_ADDRESS,
  USDC_TOKEN_ADDRESS,
  WCRO_TOKEN_ADDRESS,
} from "./address";
import { loadTokenContract } from "./loadContract";

export const tokenAddresses = [
  { label: "WCRO", value: WCRO_TOKEN_ADDRESS[NETWORK] },
  { label: "DOS", value: TOKEN_ADDRESS[NETWORK] },
  { label: "USDC", value: USDC_TOKEN_ADDRESS[NETWORK] },
];

export const getUserAllowance = async (
  address: string,
  provider: any,
  chainId: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const allowance = await token.allowance(
    address,
    AUCTION_CONTRACT_ADDRESS[NETWORK],
  );
  return formatEther(allowance);
};

export const getTokenSymbol = async (
  address: string,
  provider: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const symbol = await token.symbol();
  return String(symbol);
};

export const getUserTokenBalance = async (
  address: string,
  provider: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const balance = (await token.balanceOf(address)).toString();
  return formatEther(balance);
};

export const getUserAllowanceErc1155 = async (
  address: string,
  provider: any,
  chainId: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const allowance = (
    await token.allowance(address, AUCTION_ERC1155_CONTRACT_ADDRESS[chainId])
  ).toString();
  return formatEther(allowance);
};

export const increaseAllowance = async (
  address: string,
  provider: any,
  chainId: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const tx = await token.increaseAllowance(
    AUCTION_CONTRACT_ADDRESS[NETWORK],
    "10000000000000000000000",
  );
  await tx.wait();
};

export const increaseAllowanceErc1155 = async (
  address: string,
  provider: any,
  chainId: any,
  tokenaddress: any,
) => {
  const token = loadTokenContract(address, provider, tokenaddress);
  const tx = await token.increaseAllowance(
    AUCTION_ERC1155_CONTRACT_ADDRESS[NETWORK],
    "10000000000000000000000",
  );
  await tx.wait();
};

export const getTokenDetails = async (
  address: string,
  provider: any,
  tokenaddress: string,
) => {
  const tokenContract = loadTokenContract(address, provider, tokenaddress);

  const symbol = (await tokenContract.symbol()).toString() as string;
  const decimals = (await tokenContract.decimals()).toString() as string;

  return { symbol: symbol.toUpperCase(), decimals };
};

export const getUserTokenDetails = async (
  address: string,
  provider: any,
  chainId: string | number,
  erc20TokenAddress: string,
) => {
  const tokenContract = loadTokenContract(address, provider, erc20TokenAddress);

  const symbol = (await tokenContract.symbol()).toString() as string;
  const decimals = (await tokenContract.decimals()).toString() as string;
  const balance = (await tokenContract.balanceOf(address)).toString() as string;
  const userAllowance = await getUserAllowance(
    address,
    provider,
    chainId,
    erc20TokenAddress,
  );
  const userAllowanceErc155 = await getUserAllowanceErc1155(
    address,
    provider,
    chainId,
    erc20TokenAddress,
  );

  return {
    tokenAddress: erc20TokenAddress,
    symbol: symbol.toUpperCase(),
    decimals,
    balance: formatEther(balance),
    allowance: userAllowance,
    allowanceErc1155: userAllowanceErc155,
    isErc721Approved: userAllowance > 10 ? true : false,
    isErc1155Approved: userAllowanceErc155 > 10 ? true : false,
  };
};
