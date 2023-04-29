import React, { useCallback, useEffect, useState } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";

import { CardLoader } from "components";
import { IUserErc721Nfts } from "constants/types";
import Card from "./components/Card";
import { getApproveNFT } from "utils/methods";

interface IMyNfts {
  address: string;
  contractaddress: string;
}

const MyNfts: React.FC<IMyNfts> = ({ address, contractaddress }) => {
  const [isApproved, setIsApproved] = useState(false);
  const { account, provider, chainId } = useMoralis();
  const { data, isFetching, error } = useNFTBalances({
    address,
    token_addresses: [contractaddress],
  });
  const nftData = data?.result as IUserErc721Nfts[];

  const handleGetData = useCallback(async () => {
    if (account && provider && chainId) {
      setIsApproved(
        await getApproveNFT(account, provider, chainId, contractaddress),
      );
    }
  }, [provider, chainId, account, contractaddress]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const fetchApprove = async () => {
    setIsApproved(
      await getApproveNFT(account, provider, chainId, contractaddress),
    );
  };

  if (isFetching) return <CardLoader />;

  if (error) {
    return (
      <div className="promise_error">
        <p>something went wrong</p>
      </div>
    );
  }

  if (!nftData?.length) {
    return (
      <div className="promise_error">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="card_wrapper">
      {nftData?.map((data, i) => (
        <Card
          key={i.toString()}
          {...data}
          isApproved={isApproved}
          refetchApprove={fetchApprove}
        />
      ))}
    </div>
  );
};

export default MyNfts;
