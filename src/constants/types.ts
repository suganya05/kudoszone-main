export interface IImageFileProps {
  file: File;
  url: string;
}

export type IAttributes = {
  trait_type: string;
  value: string;
};

export interface ITokenUri {
  name: string;
  description: string;
  external_link: string;
  image: string;
  attributes: IAttributes[];
}

export interface ICreateForm {
  name: string;
  image: string;
  description: string;
  external_link: string;
  royaltyFee: string;
  totalSupply: string;
  isMultiple: boolean;
  attributes: IAttributes[];
}

export enum IContractType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export enum ISaleType {
  AUCTION = "AUCTION",
  FIXED_SALE = "FIXED_SALE",
}

export enum IMarketplaceStatus {
  LIVE = "LIVE",
  FINISHED = "FINISHED",
}

export interface ITokenDetails {
  symbol: string;
  decimals: string;
}

export interface IAuctionInfo extends ITokenUri, ITokenDetails {
  auctionId: string;
  tokenId: string;
  tokenAddress: string;
  owner: string;
  heighestBidder: string;
  heighestBid: number;
  saleType: ISaleType;
  status: IMarketplaceStatus;
  start: number;
  end: number;
  prevBidAmounts: string[];
  prevBidders: string[];
  contractType: IContractType;
  amount?: number;
  contractAddress: string;
  erc721TokenAddress: string;
}

export interface IUserErc721Nfts {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string;
  metadata?: ITokenUri;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
}

export interface IUserErc1155Nfts {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  token_uri?: string;
  metadata?: ITokenUri;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
}

export interface IUserNfts {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number?: string;
  block_number_minted?: string;
  token_uri?: string;
  metadata?: ITokenUri;
  synced_at?: string;
  amount?: string;
  name: string;
  symbol: string;
}

export interface IDropCollection {
  collection_name: string;
  contract_address: string;
  collection_slug: string;
  description: string;
  banner: string;
  avatar: string;
  start_date: Date;
  end_date: Date;
  total_supply: number;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  discord_url?: string;
  abi: any[];
  id: string;
  username: string;
}

export interface ICollectionVolume {
  _id: string;
  name: string;
  address: string;
  crovol: string;
  usdcvol: string;
  createdAt: Date;
  updatedAt: Date;
  holders: string;
}

export interface ICollectionData {
  contract_address: string;
  total: number;
  owners: string;
  volcro: string;
  volusdc: string;
  name: string;
  crofloor: number;
  img: string;
  usdcfloor: number;
  isVerified: boolean;
}

export interface ICollectionNft {
  _id: string;
  contract_type: IContractType;
  minPrice: string;
  amount: number;
  buyNowPrice: string;
  nftHighestBid: string;
  itemId: string;
  listedTime: string;
  soldTime: string;
  tokenId: string;
  nftContract: string;
  nftHighestBidder: string;
  nftSeller: string;
  paymentMethod?: string;
  listingType?: string;
  listingStatus?: string;
  nftimg: string;
  nftname: string;
  nftdescription: string;
  nftattributes: {
    trait_type: string;
    value: string;
  }[];
  attributeRarities?: {
    trait_type: string;
    value: string;
    count: number;
    ratio: number;
    ratioScore: number;
  }[];
  rarityScore?: string;
  rank?: string;
}
