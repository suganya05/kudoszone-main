import React, { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import axios from "axios";
import _ from "lodash";

import { CardLoader } from "components";
import { IUserErc1155Nfts } from "constants/types";
import { getApproveNFTerc1155 } from "utils/methods";
import Card from "./components/Card";
import { getFormattedErc1155Nfts } from "helpers/formatters";
import { getUserErc1155Nfts } from "utils/profileMethods";

interface IErc1155NftsProps {
  account: string;
  contractaddress: string;
}

const Erc1155Nfts: React.FC<IErc1155NftsProps> = ({
  account,
  contractaddress,
}) => {
  const [erc1155NftData, setErc1155NftData] = useState<IUserErc1155Nfts[]>([]);
  const { Moralis, provider, chainId } = useMoralis();
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const handleGetData = useCallback(async () => {
    const body = {
      query: `query {
        tokenTransfers(count:50,first:25,tokenContractAddressHash:"0x83F4d8F0de11338257283496e93d7B93EF054dEe"){
        edges{
          node{
            fromAddressHash
            toAddressHash
            tokenId
            amount
            id
            blockNumber
          }
        }
      }  
    }`,
    };

    if (account && provider && chainId) {
      let validTokens = [];

      const { data } = await axios.post(
        "https://cronos.org/explorer/testnet3/graphiql",
        body,
      );
      const formattedData = getFormattedErc1155Nfts(data.data);

      formattedData.forEach((d) => {
        if (d.to.toLocaleLowerCase() === account.toLocaleLowerCase()) {
          validTokens.push(d);
        }
        if (d.from.toLocaleLowerCase() === account.toLocaleLowerCase()) {
          const newData = validTokens.filter((f) => f.tokenId !== d.tokenId);
          validTokens = [...newData];
        }
      });
      const removedDuplicateData = _.uniqBy(
        validTokens,
        (obj: any) => obj.tokenId,
      );

      if (!removedDuplicateData.length) {
        setErc1155NftData([]);
        setLoading(false);
        return;
      }

      setErc1155NftData(
        await getUserErc1155Nfts(
          account,
          provider,
          contractaddress,
          removedDuplicateData,
          Moralis.Cloud,
        ),
      );
      setIsApproved(
        await getApproveNFTerc1155(account, provider, chainId, contractaddress),
      );
      setLoading(false);
    }
  }, [account, provider, chainId, Moralis.Cloud, contractaddress]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const fetchApprove = async () => {
    setIsApproved(
      await getApproveNFTerc1155(account, provider, chainId, contractaddress),
    );
  };

  if (loading) return <CardLoader />;

  if (!erc1155NftData?.length) {
    return (
      <div className="promise_error">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card_wrapper">
        {erc1155NftData?.map((data, i) => (
          <Card
            key={i.toString()}
            {...data}
            isApproved={isApproved}
            refetchApprove={fetchApprove}
          />
        ))}
      </div>
    </div>
  );
};

export default Erc1155Nfts;
