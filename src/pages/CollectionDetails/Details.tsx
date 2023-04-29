import React, { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import { ReactComponent as ExternalLink } from "assets/icons/external-link.svg";
import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import { ReactComponent as Share } from "assets/icons/share.svg";
import { ReactComponent as Verified } from "assets/icons/verified.svg";
import { Button, FilterLayout, LazyImage } from "components";
import { useGetCollectionByAddressQuery } from "store/services/exploreApi";
import { getEllipsisTxt, n6 } from "helpers/formatters";
import CardLayout from "./components/CardLayout";
import { blockExplorer } from "constants/index";
import { isNativeAddress } from "helpers/methods";
import NativeCardLayout from "./components/CardLayoutKz";
import { getActiveAuctionIdsInfo } from "utils/marketplacemethods";
import { IAuctionInfo } from "constants/types";

interface IDetailsProps {
  address: string;
}

const collectionFilters = [
  { label: "Latest Nfts", value: "null" },
  { label: "Price: Low to high", value: "asc" },
  { label: "Price: High to low", value: "desc" },
];

const Details: React.FC<IDetailsProps> = ({ address }) => {
  const { data, isLoading } = useGetCollectionByAddressQuery(address);
  const { account, provider, chainId } = useMoralis();
  const [auctionInfo, setAuctionInfo] = useState<IAuctionInfo[]>([]);
  const [selectedFilter, setSelectedfilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleGetData = useCallback(async () => {
    if (account && provider) {
      try {
        setAuctionInfo(
          await getActiveAuctionIdsInfo(account, provider, chainId, address),
        );
      } catch (error) {}
    }
  }, [address, account, provider, chainId]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  if (isLoading)
    return (
      <div className="promise_error">
        <p>Loading...</p>
      </div>
    );

  if (!data)
    return (
      <div className="promise_error">
        <p>something went wrong</p>
      </div>
    );

  const renderProfile = (
    <div className="collection_details-profile">
      <LazyImage src={data.img} />
      <div className="flex g-10">
        <h2>{data.name}</h2>
        {data?.isVerified && <Verified />}
      </div>
      <a
        href={blockExplorer(data.contract_address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex g-10"
      >
        <span>{getEllipsisTxt(data.contract_address)}</span>
        <ExternalLink className="text-primary stroke" />
      </a>
      <Button variant="ternary">
        <span>Share</span>
        <Share />
      </Button>
      <div className="flex box">
        <div>
          <p className="flex-center g-5">
            <CronosIcon width={14} height={14} className="cronos" />
            <span className="font-regular">
              {n6.format(data.crofloor / 10 ** 18)}
            </span>
          </p>
          <p>FLOOR PRICE</p>
        </div>
        <div>
          <p className="flex-center g-5">
            <CronosIcon width={14} height={14} className="cronos" />
            <span className="font-regular">
              {n6.format(Number(data.volcro))}
            </span>
          </p>
          <p>TOTAL VOL</p>
        </div>
        <div>
          <p className="flex-center font-regular">{data.total}</p>
          <p>ITEMS</p>
        </div>
        <div>
          <p className="flex-center font-regular">{data.owners}</p>
          <p>OWNERS</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="collection_details">
      {renderProfile}
      <FilterLayout
        handleChangeDropdown={(val) => setSelectedfilter(val)}
        dropdownFilter={collectionFilters}
        handleChangeInput={(val) => setSearchInput(val)}
        renderMain={
          isNativeAddress(address) ? (
            <NativeCardLayout
              address={address}
              auctionInfo={auctionInfo}
              searchInput={searchInput}
            />
          ) : (
            <CardLayout
              address={address}
              auctionInfo={auctionInfo}
              selectedFilter={selectedFilter}
              searchInput={searchInput}
            />
          )
        }
        renderFilterBox={null}
      />
    </div>
  );
};

export default Details;
