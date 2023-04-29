import { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import { IAuctionInfo } from "constants/types";
import {
  getAllAuctionDetails,
  getAllErc1155AuctionDetails,
} from "utils/marketplacemethods";

export default function useGetAuctionDetails() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IAuctionInfo[]>([]);
  const [error, setError] = useState<string | null | Error>(null);
  const { provider, account, chainId, Moralis } = useMoralis();

  const handleGetAuctionDetails = useCallback(async () => {
    if (account && provider) {
      try {
        setLoading(true);
        const data = await getAllAuctionDetails(
          account,
          provider,
          chainId,
          Moralis.Cloud,
        );
        const erc1155Data = await getAllErc1155AuctionDetails(
          account,
          provider,
          chainId,
          Moralis.Cloud,
        );
        setData([...data, ...erc1155Data]);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [account, provider, chainId, Moralis.Cloud]);

  useEffect(() => {
    handleGetAuctionDetails();
  }, [handleGetAuctionDetails]);

  return { loading, data, error, refetch: handleGetAuctionDetails };
}
