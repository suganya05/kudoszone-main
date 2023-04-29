import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import { ReactComponent as Verified } from "assets/icons/verified.svg";
// import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { useGetExploreCollectionsQuery } from "store/services/exploreApi";
import { LazyImage } from "components";
import { n6 } from "helpers/formatters";
import { ICollectionData } from "constants/types";
import Skeleton from "react-loading-skeleton";

const ExploreCollection: React.FC = () => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ICollectionData[]>([]);
  const { data, isFetching, isLoading } = useGetExploreCollectionsQuery({
    page,
  });

  useMemo(() => {
    if (data) {
      setResult((r) => r.concat(data.data));
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 20 }).map((_, id) => (
          <Skeleton key={id.toString()} count={1} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="explore_collection">
      {/* <div className="search_input">
        <SearchIcon />
        <input type="text" placeholder="search" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
      </div> */}
      <div className="explore_collection-data">
        {result.map((collection) => {
          return (
            <Link
              key={collection.name}
              to={`/collections/${collection.contract_address}`}
            >
              <div className="explore_collection-data_card">
                <div className="flex g-10">
                  <LazyImage src={collection.img} />
                  <div>
                    <p className="flex">
                      <b>{collection.name}</b>
                      {collection.isVerified && <Verified />}
                    </p>
                    <p className="flex g-5">
                      <CronosIcon width={14} height={14} className="cronos" />
                      <span>
                        {n6.format(collection.crofloor / 10 ** 18)} floor
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {isFetching ? (
        <div className="btn-view_more pb-32">
          <span>Loading...</span>
        </div>
      ) : data?.hasNextPage ? (
        <div className="btn-view_more pb-32">
          <p onClick={() => setPage((p) => p + 1)}>View more</p>
        </div>
      ) : null}
    </div>
  );
};

export default ExploreCollection;
