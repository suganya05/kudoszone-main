import React from "react";
import moment from "moment";

import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import {
  IAuctionInfo,
  IContractType,
  IMarketplaceStatus,
  ISaleType,
} from "constants/types";
import { Button, LazyImage } from "components";
import { useTransactionModal } from "hooks";
import { useMoralis } from "react-moralis";
import UnlockWallet from "components/UnlockWallet";
import { n4 } from "helpers/formatters";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

interface IOnsaleNftCard extends IAuctionInfo {
  refetch: () => Promise<void>;
}

const OnSaleNftCard: React.FC<IOnsaleNftCard> = ({
  tokenId,
  heighestBid,
  end,
  image,
  saleType,
  contractType,
  auctionId,
  symbol,
  status,
  refetch,
  erc721TokenAddress,
}) => {
  const { setTransaction, loading } = useTransactionModal();
  const { isAuthenticated, account, provider, chainId } = useMoralis();
  const navigate = useNavigate();

  const handleRemoveFixedSale = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { removeFixedSale } = await import("utils/marketplacemethods");
        await removeFixedSale(account, provider, chainId, Number(auctionId));
      } else {
        const { removeFixedSaleerc115 } = await import(
          "utils/marketplacemethods"
        );
        await removeFixedSaleerc115(
          account,
          provider,
          chainId,
          Number(auctionId),
        );
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleRemoveAuction = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { removeSale } = await import("utils/marketplacemethods");
        await removeSale(account, provider, chainId, Number(auctionId));
      } else {
        const { removeSaleerc1155 } = await import("utils/marketplacemethods");
        await removeSaleerc1155(account, provider, chainId, Number(auctionId));
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleFinishAuction = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { finishAuction } = await import("utils/marketplacemethods");
        await finishAuction(account, provider, chainId, Number(auctionId));
      } else {
        const { finishAuctionerc1155 } = await import(
          "utils/marketplacemethods"
        );
        await finishAuctionerc1155(
          account,
          provider,
          chainId,
          Number(auctionId),
        );
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const renderControls = (
    <>
      {saleType === ISaleType.AUCTION ? (
        <Countdown
          date={end}
          renderer={({ completed }) => {
            if (completed)
              return (
                <Button onClick={() => handleFinishAuction()}>
                  Finish auction
                </Button>
              );
            return (
              <Button onClick={() => handleRemoveAuction()}>
                Remove from sale
              </Button>
            );
          }}
        />
      ) : (
        <Button disabled={loading} onClick={() => handleRemoveFixedSale()}>
          Remove from sale
        </Button>
      )}
    </>
  );

  return (
    <div className="nft_card">
      <div
        className="nft_card-container"
        onClick={() =>
          navigate(`/collections/${erc721TokenAddress}/${tokenId}`)
        }
      >
        <div className="nft_card-container_image">
          <LazyImage src={image} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <p>
              Token Id #<b>{tokenId}</b>
            </p>
          </div>
          <div className="flex-between">
            <p>Price</p>
            <div className="flex g-5">
              <CronosIcon width={14} height={14} className="cronos" />
              <b>
                {n4.format(heighestBid)}&nbsp;{symbol}
              </b>
            </div>
          </div>
          {saleType === ISaleType.AUCTION && (
            <div className="flex-between">
              <p>Ends in</p>
              <p>{moment(end).fromNow()}</p>
            </div>
          )}
          <div className="flex-between">
            <p>Contract Type</p>
            <b>{contractType}</b>
          </div>
        </div>
        <div className="nft_card-container_controls">
          {isAuthenticated ? (
            status === IMarketplaceStatus.FINISHED ? null : (
              renderControls
            )
          ) : (
            <UnlockWallet />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnSaleNftCard;
