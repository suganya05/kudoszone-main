import React from "react";
import { useParams } from "react-router-dom";

import "./CollectionDetails.scss";
import Details from "./Details";

const CollectionDetails: React.FC<{}> = () => {
  const { address } = useParams();
  return (
    <div className="collection_route">
      <div className="mx pad">
        <Details address={address} />
      </div>
    </div>
  );
};

export default CollectionDetails;
