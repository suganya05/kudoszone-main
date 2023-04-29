import React from "react";
import { useMoralis } from "react-moralis";

import UnlockWallet from "components/UnlockWallet";
import { IUserNfts } from "constants/types";
import CardModal from "./CardModal";
import { LazyImage } from "components";
import { useNavigate } from "react-router-dom";

interface ICard extends IUserNfts {
  isApproved: boolean;
  refetchApprove: () => Promise<void>;
}

const Card: React.FC<ICard> = (props) => {
  const { token_id, metadata, isApproved, refetchApprove, token_address } =
    props;
  const { isAuthenticated } = useMoralis();
  const navigate = useNavigate();
  return (
    <div className="nft_card">
      <div
        className="nft_card-container"
        onClick={() => navigate(`/collections/${token_address}/${token_id}`)}
      >
        <div className="nft_card-container_image">
          <LazyImage src={metadata?.image} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: "3.2rem", lineHeight: "3.2rem" }}>
              {metadata ? metadata.name : "unnamed"}
            </h3>
          </div>
          <div>
            <p>
              Token Id #<b>{token_id}</b>
            </p>
          </div>
        </div>
        <div className="nft_card-container_controls">
          {isAuthenticated ? (
            <CardModal
              {...props}
              isApproved={isApproved}
              refetchApprove={refetchApprove}
            />
          ) : (
            <UnlockWallet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
