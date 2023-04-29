import { ICollectionNft, ICreateForm } from "constants/types";
import { ethers } from "ethers";

export const formatEther = (value: any, decimals = 18) => {
  return Number(ethers.utils.formatUnits(value.toString(), String(decimals)));
};

export const parseEther = (value: any, decimals = 18) => {
  return ethers.utils.parseUnits(value.toString(), String(decimals)).toString();
};

export const formatLinks = (link: string) => {
  const lowercaseString = link.toLocaleLowerCase();
  return lowercaseString.split(" ").join("-");
};

export const n6 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});
export const n4 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 18,
});

export const c2 = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str: string, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};

export const tokenValue = (value, decimals) =>
  decimals ? value / Math.pow(10, decimals) : value;

/**
 * Return a formatted string with the symbol at the end
 * @param {number} value integer value
 * @param {number} decimals number of decimals
 * @param {string} symbol token symbol
 * @returns {string}
 */
export const tokenValueTxt = (value, decimals, symbol) =>
  `${n4.format(tokenValue(value, decimals))} ${symbol}`;

export const getFormattedFormValues = (values: ICreateForm) => {
  return {
    name: values.name,
    description: values.description,
    external_link: values.external_link,
    image: values.image,
    attributes: values.attributes.filter(
      (f) => f.trait_type !== "" && f.value !== "",
    ),
  };
};

export const getFormattedErc1155Nfts = (data) => {
  return data.tokenTransfers.edges.map((edge) => {
    return {
      amount: edge.node.amount,
      blockNumber: edge.node.blockNumber,
      from: edge.node.fromAddressHash,
      to: edge.node.toAddressHash,
      tokenId: edge.node.tokenId,
    };
  });
};

export const formatNftObject = (data: any) => {
  const metadata = JSON.parse(data?.metadata);
  const res: ICollectionNft = {
    _id: Math.random().toString(),
    contract_type: data.contract_type,
    minPrice: "",
    buyNowPrice: "",
    nftHighestBid: "",
    itemId: data.token_id,
    listedTime: "",
    soldTime: "",
    tokenId: data.token_id,
    nftContract: data.token_address,
    nftHighestBidder: "",
    nftSeller: data.owner_of,
    nftimg: metadata?.image,
    nftname: metadata?.name,
    nftdescription: metadata?.description,
    nftattributes: metadata?.attributes,
    amount: Number(data.amount),
  };

  return res;
};

export const compareAddress = (address1: string, address2: string) =>
  address1?.toLocaleLowerCase() === address2?.toLocaleLowerCase();
