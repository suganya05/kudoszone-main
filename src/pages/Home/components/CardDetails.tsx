import React, { useState } from "react";

// import { ReactComponent as HeartIcon } from "assets/icons/heart.svg";
import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import { ReactComponent as User } from "assets/icons/user-circle.svg";
import { n6 } from "helpers/formatters";

interface ICardDetails {
  image: string;
  likes: number;
  price: number;
  collection_name: string;
  owner: string;
}

const CardDetails: React.FC<ICardDetails> = ({
  image,
  likes,
  price,
  collection_name,
  owner,
}) => {
  const [error, setError] = useState(false);

  return (
    <div className="flex-between">
      <div className="flex g-10">
        {error ? (
          <User />
        ) : (
          <img
            src={image}
            onError={() => setError(true)}
            alt={"nft collection"}
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
        )}
        <div>
          <p className="font-regular">{collection_name}</p>
          <p style={{ fontSize: "12px" }}>{owner}</p>
        </div>
      </div>
      <div>
        <div className="flex g-5">
          {/* <HeartIcon />
          <p className="font-regular">{likes}</p> */}
        </div>
        <div className="flex g-5">
          <CronosIcon width={14} height={14} className="cronos" />
          <p className="font-regular">{n6.format(price)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
