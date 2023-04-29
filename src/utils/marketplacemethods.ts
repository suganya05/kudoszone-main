import {
  IAuctionInfo,
  IContractType,
  IMarketplaceStatus,
  ISaleType,
} from "constants/types";
import { formatEther, parseEther } from "helpers/formatters";
import {
  loadMarketplace1155Contract,
  loadMarketplaceContract,
  loadNft1155Contract,
  loadNftContract,
  loadTokenContract,
} from "./loadContract";
import { getTokenDetails } from "./tokenmethods";

export const getIpfsData = async (Cloud, url: string) => {
  try {
    const { data } = await Cloud.run("fetchJSON", {
      theUrl: url,
    });
    return {
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      name: "",
      description: "",
      external_link: "",
      image: "",
      attributes: [],
    };
  }
};
export const getCollectionStatus = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenId: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const collectionInfo = await auction.getCollectionStatus(tokenId);
  return collectionInfo;
};

export const getAuctionInfoById = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionId: number | string,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const auctionInfo = await auction.auctionInfo(auctionId);
  const tokenDetails = await getTokenDetails(
    address,
    provider,
    auctionInfo.tokenaddress,
  );

  return {
    auctionId: auctionId.toString(),
    contractAddress: auction.address,
    tokenId: auctionInfo.tokenId.toString(),
    owner: auctionInfo.auctioner,
    heighestBidder: auctionInfo.highestBidder,
    heighestBid: formatEther(auctionInfo.highestBid.toString()),
    saleType:
      auctionInfo.saleType.toString() === "0"
        ? ISaleType.AUCTION
        : ISaleType.FIXED_SALE,
    status:
      auctionInfo.status.toString() === "0"
        ? IMarketplaceStatus.LIVE
        : IMarketplaceStatus.FINISHED,
    start: Number(auctionInfo.start.toString()) * 1000,
    end: Number(auctionInfo.end.toString()) * 1000,
    prevBidAmounts: auctionInfo.prevBidAmounts,
    prevBidders: auctionInfo.prevBidders,
    tokenAddress: auctionInfo.tokenaddress,
    contractType: IContractType.ERC721,
    ...tokenDetails,
    erc721TokenAddress: auctionInfo.tokencontract,
  };
};

export const getAuctionInfoErc1155ById = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionId: number | string,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const auctionInfo = await auction.auctionInfo(Number(auctionId) + 1);

  return {
    auctionId: auctionId.toString(),
    contractAddress: auction.address,
    tokenId: auctionInfo.tokenId.toString(),
    owner: auctionInfo.auctioner,
    heighestBidder: auctionInfo.highestBidder,
    heighestBid: formatEther(auctionInfo.highestBid.toString()),
    saleType:
      auctionInfo.saleType.toString() === "0"
        ? ISaleType.AUCTION
        : ISaleType.FIXED_SALE,
    status:
      auctionInfo.status.toString() === "0"
        ? IMarketplaceStatus.LIVE
        : IMarketplaceStatus.FINISHED,
    start: Number(auctionInfo.start.toString()) * 1000,
    end: Number(auctionInfo.end.toString()) * 1000,
    prevBidAmounts: auctionInfo.prevBidAmount,
    prevBidders: auctionInfo.prevBid,
    tokenAddress: auctionInfo.tokenaddress,
    contractType: IContractType.ERC1155,
    amount: Number(auctionInfo.amount.toString()),
    erc721TokenAddress: "0xFdbF8997df9F013819660603E47884487908DAA4",
  };
};

export const getAllAuctionDetails = async (
  address: string,
  provider: any,
  chainId: number | string,
  Cloud: any,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const totalAuctionIds = Number((await auction.totalAuction()).toString());

  const result = await Promise.all(
    Array.from({ length: totalAuctionIds }).map(async (_, id) => {
      return await getAuctionInfoById(address, provider, chainId, id);
    }),
  );

  const filterLiveAuctions = result.filter(
    (f) => f.status === IMarketplaceStatus.LIVE,
  );

  const data: IAuctionInfo[] = await Promise.all(
    filterLiveAuctions.map(async (res) => {
      const nftContract = loadNftContract(address, provider, res.tokenAddress);
      const tokenURI = await nftContract.tokenURI(res.tokenId);
      const ipfsData = await getIpfsData(Cloud, tokenURI);
      const tokenContract = loadTokenContract(
        address,
        provider,
        res.tokenAddress,
      );
      const tokenSymbol = await tokenContract.symbol();

      return {
        ...res,
        ...ipfsData,
        tokenSymbol,
      };
    }),
  );
  console.log(data);
  return data;
};

export const getAllErc1155AuctionDetails = async (
  address: string,
  provider: any,
  chainId: number | string,
  Cloud: any,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const totalAuctionIds = Number((await auction.totalAuction()).toString());

  const result = await Promise.all(
    Array.from({ length: totalAuctionIds }).map(async (_, id) => {
      return await getAuctionInfoErc1155ById(address, provider, chainId, id);
    }),
  );

  const filterLiveAuctions = result.filter(
    (f) => f.status === IMarketplaceStatus.LIVE,
  );

  const data: IAuctionInfo[] = await Promise.all(
    filterLiveAuctions.map(async (res) => {
      const nftContract = loadNft1155Contract(
        address,
        provider,
        res.tokenAddress,
      );
      const tokenURI = await nftContract.tokenURI(res.tokenId);
      const ipfsData = await getIpfsData(Cloud, tokenURI);
      const tokenContract = loadTokenContract(
        address,
        provider,
        res.tokenAddress,
      );

      const tokenSymbol = await tokenContract.symbol();

      return {
        ...res,
        ...ipfsData,
        tokenSymbol,
      };
    }),
  );
  console.log(data);
  return data;
};

export const createAuction = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
  price: number,
  erc20TokenAddress: string,
  days: string | number,
  erc721TokenAddress: string,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.createSaleAuction(
    tokenid,
    parseEther(price),
    erc20TokenAddress,
    days,
    erc721TokenAddress,
  );
  await tx.wait();
};

export const createAuction1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
  amount: number,
  price: number,
  tokenaddress: string,
  days: string | number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.createSaleAuction(
    tokenid,
    amount,
    parseEther(price),
    days,
    tokenaddress,
  );
  await tx.wait();
};

export const createFixedSale = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
  price: number,
  erc20TokenAddress: string,
  erc721TokenAddress: string,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.fixedSale(
    tokenid,
    parseEther(price),
    erc20TokenAddress,
    erc721TokenAddress,
  );
  await tx.wait();
};

export const createFixedSale1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
  price: number,
  tokenaddress: string,
  amount: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.fixedSale(
    tokenid,
    parseEther(price),
    tokenaddress,
    amount,
  );
  await tx.wait();
};

export const placeBid = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
  amount: number,
) => {
  const parsedAmount = parseEther(amount);
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.placeBid(auctionid, parsedAmount);
  await tx.wait();
};

export const placeBid1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
  amount: number,
) => {
  const parsedAmount = parseEther(amount);
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.placeBid(auctionid, parsedAmount);
  await tx.wait();
};

export const finishFixedSale = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionId: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.finishFixedSale(auctionId);
  await tx.wait();
};

export const finishFixedSaleErc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionId: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.finishFixedSale(auctionId);
  await tx.wait();
};

export const finishAuction = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.finishAuction(auctionid);
  await tx.wait();
};

export const finishAuctionerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.finishAuction(auctionid);
  await tx.wait();
};

export const getRoyaltyFee = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const royaltyFee = await auction.getRoyaltyFee(tokenid);
  return royaltyFee;
};

export const getRoyaltyFeeerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const royaltyFee = await auction.getRoyaltyFee(tokenid);
  return royaltyFee;
};

export const getOwner = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const owner = await auction.getOwner(tokenid);
  return owner;
};

export const getOwnererc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const owner = await auction.getOwner(tokenid);
  return owner;
};

export const getTotalAuction = async (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const totalAuction = await auction.totalAuction();
  return totalAuction;
};

export const getTotalAuctionerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const totalAuction = await auction.totalAuction();
  return totalAuction;
};

export const removeSale = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.removeSale(auctionid);
  await tx.wait();
};

export const removeSaleerc1155 = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.removeSale(auctionid);
  await tx.wait();
};

export const removeFixedSale = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplaceContract(address, provider, chainId);
  const tx = await auction.removeSaleFixed(auctionid);
  await tx.wait();
};

export const removeFixedSaleerc115 = async (
  address: string,
  provider: any,
  chainId: number | string,
  auctionid: number,
) => {
  const auction = loadMarketplace1155Contract(address, provider, chainId);
  const tx = await auction.removeSaleFixed(auctionid);
  await tx.wait();
};

export const getAuctionById = async (
  address: string,
  provider,
  chainId,
  Cloud,
  auctionId: string,
) => {
  try {
    const auctionInfo = await getAuctionInfoById(
      address,
      provider,
      chainId,
      auctionId,
    );

    const nftContract = loadNftContract(address, provider, chainId);
    const tokenURI = await nftContract.tokenURI(auctionInfo.tokenId);
    const ipfsData = await getIpfsData(Cloud, tokenURI);
    const tokenContract = loadTokenContract(
      address,
      provider,
      auctionInfo.tokenAddress,
    );
    const tokenSymbol = await tokenContract.symbol();

    return {
      ...auctionInfo,
      ...ipfsData,
      tokenSymbol,
    };
  } catch (error) {
    return null;
  }
};

export const getActiveAuctionIdsInfo = async (
  address: string,
  provider,
  chainId,
  contractaddress,
) => {
  const auctionContract = loadMarketplaceContract(address, provider, chainId);
  const activeIds = await auctionContract.getActiveId(contractaddress);
  const auctionIds = activeIds.map((a) => a.toString());

  const result: IAuctionInfo[] = await Promise.all(
    auctionIds.map(async (id) => {
      return await getAuctionInfoById(address, provider, chainId, id);
    }),
  );

  const filterLiveAuctions = result.filter(
    (f) => f.status === IMarketplaceStatus.LIVE,
  );

  return filterLiveAuctions;
};

export const getErc1155AuctionById = async (
  address: string,
  provider,
  chainId,
  Cloud,
  auctionId: string,
) => {
  const auctionInfo = await getAuctionInfoErc1155ById(
    address,
    provider,
    chainId,
    auctionId,
  );

  const nftContract = loadNft1155Contract(address, provider, chainId);
  const tokenURI = await nftContract.tokenURI(auctionInfo.tokenId);
  const ipfsData = await getIpfsData(Cloud, tokenURI);
  const tokenContract = loadTokenContract(
    address,
    provider,
    auctionInfo.tokenAddress,
  );
  const tokenSymbol = await tokenContract.symbol();

  return {
    ...auctionInfo,
    ...ipfsData,
    tokenSymbol,
  };
};
