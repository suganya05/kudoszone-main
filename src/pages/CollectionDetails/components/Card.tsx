import React from "react";
import { useMoralis } from "react-moralis";
import { useNavigate } from "react-router-dom";

// import { ReactComponent as EthereumIcon } from "assets/icons/ethereum.svg";
import { IAuctionInfo, ICollectionNft } from "constants/types";
import { compareAddress, getEllipsisTxt } from "helpers/formatters";
import { Button, LazyImage } from "components";
import CardControls from "./CardControls";
import UnlockWallet from "components/UnlockWallet";
import ListCardControls from "./ListCardControls";

interface ICollectionCardProps extends ICollectionNft {
  auctionInfo?: IAuctionInfo | null;
  refetch?: () => Promise<void>;
  isApproved?: boolean;
}

const Card: React.FC<ICollectionCardProps> = (props) => {
  const {
    nftimg,
    nftname,
    tokenId,
    nftSeller,
    nftContract,
    itemId,
    auctionInfo,
    refetch,
    isApproved,
  } = props;
  const { isAuthenticated, account } = useMoralis();
  const isOwner = compareAddress(account, nftSeller);
  const navigate = useNavigate();

  return (
    <div className="nft_card">
      <div
        className="nft_card-container"
        onClick={() => navigate(`/collections/${nftContract}/${itemId}`)}
      >
        <div className="nft_card-container_image">
          <LazyImage src={nftimg} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <p>{nftname ?? "unnamed"}</p>
          </div>
          <div>
            <p>
              Token Id <b style={{ fontSize: "2rem" }}>#{tokenId}</b>
            </p>
          </div>
          {!!nftSeller && (
            <div className="flex-between">
              <p>owner</p>
              <b>{getEllipsisTxt(nftSeller)}</b>
            </div>
          )}
        </div>
        <div
          className="nft_card-container_controls"
          onClick={(e) => e.stopPropagation()}
        >
          {isAuthenticated ? (
            auctionInfo ? (
              <CardControls
                {...auctionInfo}
                isApproved={isApproved}
                refetch={refetch}
              />
            ) : isOwner ? (
              <ListCardControls
                {...props}
                isApproved={isApproved}
                refetchApprove={refetch}
              />
            ) : (
              <Button
                onClick={() =>
                  navigate(`/collections/${nftContract}/${itemId}`)
                }
              >
                View details
              </Button>
            )
          ) : (
            <UnlockWallet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
