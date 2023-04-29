import React, { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

import { CardLoader } from "components";
import { IAuctionInfo, ICollectionNft, IContractType } from "constants/types";
import { formatNftObject } from "helpers/formatters";
import { getApproveNFT, getApproveNFTerc1155 } from "utils/methods";
import Card from "./Card";
import {
  getMetadataOfTokenId,
  getOwnerOfNft,
  getOwnerOfNftErc1155,
} from "utils/nftMethods";
import { useTransactionModal } from "hooks";
import { isErc1155Contract } from "helpers/methods";

interface INativeCardLayoutProps {
  address: string;
  auctionInfo: IAuctionInfo[];
  searchInput: string;
}

const NativeCardLayout: React.FC<INativeCardLayoutProps> = ({
  address,
  auctionInfo,
  searchInput,
}) => {
  const [isError, setIsError] = useState(false);
  const [moralisResult, setMoralisResult] = useState<any>(null);
  const [result, setResult] = useState<ICollectionNft[]>([]);
  const [data, setData] = useState<ICollectionNft[]>([]);
  const web3Api = useMoralisWeb3Api();
  const [isLoading, setIsLoading] = useState(false);
  const { account, provider, chainId, isInitialized, Moralis } = useMoralis();
  const [isApproved, setIsApproved] = useState(false);
  const { setTransaction } = useTransactionModal();

  const handleFetchIsApproved = useCallback(async () => {
    if (account && provider && chainId) {
      if (isErc1155Contract(address)) {
        return setIsApproved(
          await getApproveNFTerc1155(account, provider, chainId, address),
        );
      }
      setIsApproved(await getApproveNFT(account, provider, chainId, address));
    }
  }, [account, provider, chainId, address]);

  const handleGetData = useCallback(async () => {
    if (isInitialized) {
      try {
        setIsLoading(true);
        const options: any = {
          chain: "0x152",
          address,
          limit: 12,
        };
        const res: any = await web3Api.token.getAllTokenIds(options);

        if (account && provider) {
          const nftData: ICollectionNft[] = res?.result?.map((d) =>
            formatNftObject(d),
          );
          const newData = await Promise.all(
            nftData.map(async (d) => {
              if (d.contract_type === IContractType.ERC1155) {
                const ipfsData = await getMetadataOfTokenId(
                  account,
                  provider,
                  d.nftContract,
                  d.tokenId,
                  Moralis.Cloud,
                );
                d.nftname = ipfsData?.name;
                d.nftimg = ipfsData?.image;
              }
              return {
                ...d,
                nftSeller:
                  d.contract_type === IContractType.ERC1155
                    ? await getOwnerOfNftErc1155(
                        account,
                        provider,
                        d.nftContract,
                        d.tokenId,
                      )
                    : await getOwnerOfNft(
                        account,
                        provider,
                        d.nftContract,
                        d.tokenId,
                      ),
              };
            }),
          );
          setData(newData);
          setMoralisResult(res);
          setIsError(false);
          setIsLoading(false);
        } else {
          setData(res?.result?.map((d) => formatNftObject(d)));
          setMoralisResult(res);
          setIsError(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, address, account, provider, Moralis.Cloud]);

  useEffect(() => {
    handleGetData();
    handleFetchIsApproved();
  }, [handleGetData, handleFetchIsApproved]);

  useMemo(async () => {
    if (!searchInput) return;
    try {
      const options: any = {
        address,
        token_id: searchInput,
        chain: "0x152",
      };
      const data = await web3Api.token.getTokenIdMetadata(options);
      setResult([formatNftObject(data)]);
    } catch (error) {
      console.log(error);
      setTransaction({
        loading: true,
        status: "error",
        message: `There is no such token id ${searchInput}`,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, web3Api.token, address]);

  useMemo(() => {
    if (data) {
      setResult((r) => r.concat(data));
    }
  }, [data]);

  const hasNext = useMemo(() => {
    return moralisResult?.cursor === null ? false : true;
  }, [moralisResult]);

  const handleFetchData = async () => {
    const res = await moralisResult?.next();

    if (account && provider) {
      const nftData = res?.result?.map((d) => formatNftObject(d));
      const newData = await Promise.all(
        nftData.map(async (d) => {
          return {
            ...d,
            nftSeller: await getOwnerOfNft(
              account,
              provider,
              address,
              d.tokenId,
            ),
          };
        }),
      );
      setData(newData);
      setMoralisResult(res);
    } else {
      setData(res?.result?.map((d) => formatNftObject(d)));
      setMoralisResult(res);
    }
  };

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

export default NativeCardLayout;
