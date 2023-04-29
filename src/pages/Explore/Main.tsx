import React, { useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { CardLoader } from "components";
import { useGetExploreRandomCollectionsQuery } from "store/services/exploreApi";
import { ICollectionNft } from "constants/types";
import Card from "pages/CollectionDetails/components/Card";
import { useMoralisWeb3Api } from "react-moralis";
import { formatNftObject } from "helpers/formatters";

interface IExploreMainProps {
  selectedFilter: string | null;
  searchInput: string;
}

const Main: React.FC<IExploreMainProps> = ({ selectedFilter, searchInput }) => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ICollectionNft[]>([]);
  const { data, isError, isFetching } = useGetExploreRandomCollectionsQuery({
    page,
  });
  const web3Api = useMoralisWeb3Api();

  useMemo(async () => {
    if (!searchInput) return;
    try {
      const addresses = result.map((res) => res.nftContract);
      const uinqAddresses = [...new Set(addresses)];
      const newData = await Promise.all(
        uinqAddresses.map(async (res) => {
          const options: any = {
            address: res,
            token_id: searchInput,
            chain: "cronos",
          };
          const data = await web3Api.token.getTokenIdMetadata(options);
          return formatNftObject(data);
        }),
      );
      setResult(newData);
    } catch (error) {}
  }, [searchInput, web3Api.token, result]);

  useMemo(() => {
    if (selectedFilter) {
      setPage(1);
      if (selectedFilter === "asc") {
        return setResult((r) =>
          r.sort((a, b) => Number(a.buyNowPrice) - Number(b.buyNowPrice)),
        );
      }

      setResult((r) =>
        r.sort((a, b) => Number(b.buyNowPrice) - Number(a.buyNowPrice)),
      );
    }
  }, [selectedFilter]);

  useMemo(() => {
    if (data) {
      setResult((r) => r.concat(data));
    }
  }, [data]);

  const handleFetchData = () => setPage((p) => p + 1);

  if (isError) {
    return (
      <div className="promise_error">
        <p>something went wrong</p>
      </div>
    );
  }

  if (isFetching) return <CardLoader />;

  return (
    <div>
      <InfiniteScroll
        dataLength={result.length}
        next={handleFetchData}
        hasMore={true}
        loader={
          <div className="pb-32 pt-32">
            <CardLoader />
          </div>
        }
      >
        <div className="card_wrapper">
          {result.map((m, index) => (
            <Card key={index.toString()} {...m} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Main;
