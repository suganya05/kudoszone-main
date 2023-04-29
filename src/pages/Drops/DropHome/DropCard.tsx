import React from "react";
import { Link } from "react-router-dom";

import { IDropCollection } from "constants/types";
import { LazyImage } from "components";

interface IDropCard extends IDropCollection {
  isUpcoming?: boolean;
}

const DropCard: React.FC<IDropCard> = ({
  banner,
  avatar,
  collection_name,
  collection_slug,
  isUpcoming,
}) => {
  const renderCollection = (
    <div className="nft_card-container">
      <div className="nft_card-container_image">
        <LazyImage src={banner} alt="avatar" />
      </div>
      <div className="nft_card-container_content">
        <div className="flex g-10">
          <img
            src={avatar}
            alt="avatar"
            width={30}
            style={{
              borderRadius: "50%",
              height: "30px",
              objectFit: "cover",
            }}
          />
          <div>
            <p>
              <strong>{collection_name}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nft_card">
      {!!isUpcoming ? (
        renderCollection
      ) : (
        <Link to={`/drops/${collection_slug}`}>{renderCollection}</Link>
      )}
    </div>
  );
};

export default DropCard;
