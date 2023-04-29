import {
  IAuctionInfo,
  IContractType,
  IMarketplaceStatus,
  IUserErc1155Nfts,
} from "constants/types";
import {
  loadMarketplace1155Contract,
  loadMarketplaceContract,
  loadNft1155Contract,
  loadNftContract,
  loadTokenContract,
} from "./loadContract";
import {
  getAuctionInfoById,
  getAuctionInfoErc1155ById,
  getIpfsData,
} from "./marketplacemethods";

export const getAuctionIdByTokenId = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenId: string | number,
) => {
  try {
    const auction = loadMarketplaceContract(address, provider, chainId);
    const id = await auction.getAuctionId(tokenId);
    const auctionId = Number(id.toString());
    return auctionId > 0 ? auctionId - 1 : -1;
  } catch (error) {
    return -1;
  }
};

export const getAuctionIdErc1155ByTokenId = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenId: string | number,
) => {
  try {
    const auction = loadMarketplace1155Contract(address, provider, chainId);
    const id = await auction.getAuctionId(tokenId);
    const auctionId = Number(id.toString());
    return auctionId > 0 ? auctionId - 1 : -1;
  } catch (error) {
    return -1;
  }
};

export const getUserNfts = async (
  account,
  provider,
  chainId,
  tokenIds: string[],
  Cloud,
) => {
  const nftContract = loadNftContract(account, provider, chainId);

  const result = await Promise.all(
    tokenIds.map(async (id) => {
      const tokenURI = await nftContract.tokenURI(id);
      const ipfsData = await getIpfsData(Cloud, tokenURI);
      const auctionId = await getAuctionIdByTokenId(
        account,
        provider,
        chainId,
        id,
      );
      let auctionData = undefined;

      if (auctionId >= 0) {
        auctionData = await getAuctionInfoById(
          account,
          provider,
          chainId,
          auctionId + 1,
        );
      }

      return {
        tokenId: id,
        ...ipfsData,
        contractType: IContractType.ERC721,
        auctionData,
      };
    }),
  );

  console.log(result);
  return result;
};

export const getUserErc1155Nfts = async (
  account: string,
  provider,
  erc1155TokenAddress: string,
  data: any[],
  Cloud,
) => {
  const nftContract = loadNft1155Contract(
    account,
    provider,
    erc1155TokenAddress,
  );

  const result: IUserErc1155Nfts[] = await Promise.all(
    data.map(async (d) => {
      const tokenURI = await nftContract.tokenURI(d.tokenId);
      const ipfsData = await getIpfsData(Cloud, tokenURI);
      return {
        token_id: d.tokenId,
        metadata: { ...ipfsData },
        amount: d.amount,
        owner_of: d.to,
        contract_type: IContractType.ERC1155,
        token_address: erc1155TokenAddress,
        name: ipfsData.name,
        symbol: "",
      };
    }),
  );

  console.log(result);
  return result;
};

export const getUserOnsaleNfts = async (
  address: string,
  provider,
  chainId: string | number,
  Cloud: any,
) => {
  const erc721AuctionContract = loadMarketplaceContract(
    address,
    provider,
    chainId,
  );

  const auctionIds = Number(
    (await erc721AuctionContract.totalAuction()).toString(),
  );

  const result = await Promise.all(
    Array.from({ length: auctionIds }).map(async (_, id) => {
      return await getAuctionInfoById(address, provider, chainId, id);
    }),
  );

  const filterLiveAuctions = result.filter(
    (f) =>
      f.status === IMarketplaceStatus.LIVE &&
      f.owner.toLocaleLowerCase() === address.toLocaleLowerCase(),
  );

  const data: IAuctionInfo[] = await Promise.all(
    filterLiveAuctions.map(async (res) => {
      const nftContract = loadNftContract(
        address,
        provider,
        res.erc721TokenAddress,
      );
      const tokenURI = await nftContract.tokenURI(res.tokenId);
      const ipfsData = await getIpfsData(Cloud, tokenURI);

      return {
        ...res,
        ...ipfsData,
      };
    }),
  );
  console.log(data);
  return data;
};

export const getUserErc1155OnsaleNfts = async (
  address: string,
  provider,
  chainId: string | number,
  Cloud: any,
) => {
  const erc1155AuctionContract = loadMarketplace1155Contract(
    address,
    provider,
    chainId,
  );

  const auctionIds = Number(
    (await erc1155AuctionContract.totalAuction()).toString(),
  );

  const result = await Promise.all(
    Array.from({ length: auctionIds }).map(async (_, id) => {
      return await getAuctionInfoErc1155ById(address, provider, chainId, id);
    }),
  );

  const filterLiveAuctions = result.filter(
    (f) =>
      f.status === IMarketplaceStatus.LIVE &&
      f.owner.toLocaleLowerCase() === address.toLocaleLowerCase(),
  );

  const data: IAuctionInfo[] = await Promise.all(
    filterLiveAuctions.map(async (res) => {
      const nftContract = loadNft1155Contract(
        address,
        provider,
        res.erc721TokenAddress,
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
