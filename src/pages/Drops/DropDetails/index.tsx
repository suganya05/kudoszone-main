import PageNotFound from "pages/PageNotFound";
import React from "react";
import { useParams } from "react-router-dom";
import Details from "./Details";

const DropDetails: React.FC<{}> = () => {
  const { collection } = useParams();

  if (!collection) return <PageNotFound />;

  return (
    <div className="drop_details_route">
      <div className="mx">
        <Details collection_slug={collection} />
      </div>
    </div>
  );
};

export default DropDetails;
