import React, { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import { CardLoader } from "components";
import {
  getUserErc1155OnsaleNfts,
  getUserOnsaleNfts,
} from "utils/profileMethods";
import OnSaleNftCard from "./components/OnsaleNftCard";

const OnSaleNfts: React.FC<{}> = () => {
  const { chainId, provider, account, Moralis } = useMoralis();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleGetOnsaleNfts = useCallback(async () => {
    if (account && provider) {
      try {
        setLoading(true);
        const erc721Nfts = await getUserOnsaleNfts(
          account,
          provider,
          chainId,
          Moralis.Cloud,
        );
        const erc1155Nfts = await getUserErc1155OnsaleNfts(
          account,
          provider,
          chainId,
          Moralis.Cloud,
        );
        setData([...erc721Nfts, ...erc1155Nfts]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [account, provider, chainId, Moralis.Cloud]);

  useEffect(() => {
    handleGetOnsaleNfts();
  }, [handleGetOnsaleNfts]);

  if (loading) return <CardLoader />;

  if (!data || !data.length)
    return (
      <div className="promise_error">
        <p>No data found</p>
      </div>
    );

  return (
    <div>
      <div className="card_wrapper">
        {data.map((d, i) => (
          <OnSaleNftCard
            key={i.toString()}
            {...d}
            refetch={handleGetOnsaleNfts}
          />
        ))}
      </div>
    </div>
  );
};

export default OnSaleNfts;
