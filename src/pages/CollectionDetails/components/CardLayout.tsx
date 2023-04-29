import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

import Card from "./Card";
import { CardLoader } from "components";
import { IAuctionInfo, ICollectionNft } from "constants/types";
import { useGetItemsByAddressQuery } from "store/services/exploreApi";
import { getApproveNFT } from "utils/methods";
import { formatNftObject } from "helpers/formatters";

interface ICardLayoutProps {
  address: string;
  auctionInfo: IAuctionInfo[];
  selectedFilter: string | null;
  searchInput: string;
}

const CardLayout: React.FC<ICardLayoutProps> = ({
  address,
  auctionInfo,
  selectedFilter,
  searchInput,
}) => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ICollectionNft[]>([]);
  const { data, isError, isLoading } = useGetItemsByAddressQuery({
    address,
    page,
    qsort: selectedFilter,
  });
  const { account, provider, chainId } = useMoralis();
  const [isApproved, setIsApproved] = useState(false);
  const web3Api = useMoralisWeb3Api();

  useMemo(async () => {
    if (!searchInput) return;
    const options: any = {
      address,
      token_id: searchInput,
      chain: "cronos",
    };
    const data = await web3Api.token.getTokenIdMetadata(options);
    setResult([formatNftObject(data)]);
  }, [searchInput, web3Api.token, address]);

  const handleFetchIsApproved = useCallback(async () => {
    if (account && provider && chainId) {
      setIsApproved(await getApproveNFT(account, provider, chainId, address));
    }
  }, [account, provider, chainId, address]);

  useMemo(() => {
    if (selectedFilter) {
      setPage(1);
      setResult([]);
    }
  }, [selectedFilter]);

  useMemo(() => {
    if (data) {
      setResult((r) => r.concat(data));
    }
  }, [data]);

  const hasNext = useMemo(() => {
    return 1 <= Math.floor(data?.length / 12);
  }, [data]);

  const handleFetchData = () => setPage((p) => p + 1);

  if (isLoading)
    return (
      <div>
        <CardLoader />
      </div>
    );

  if (isError) {
    return (
      <div className="promise_error">
        <p>Something went wrong</p>
      </div>
    );
  }

  if (!result.length) {
    return (
      <div className="promise_error">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={result.length}
        next={handleFetchData}
        hasMore={hasNext}
        loader={
          <div className="pb-32 pt-32">
            <CardLoader />
          </div>
        }
      >
        <div className="card_wrapper">
          {result.map((m) => (
            <Card
              key={m._id}
              {...m}
              isApproved={isApproved}
              refetch={handleFetchIsApproved}
              auctionInfo={auctionInfo.find((f) => f.tokenId === m.tokenId)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default CardLayout;
