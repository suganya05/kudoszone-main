import { IDropCollection } from "constants/types";
import React from "react";
import DropCard from "./DropCard";

interface IDropHomeDetails {
  title: string;
  data: IDropCollection[];
  isUpcoming?: boolean;
}

const DropHomeDetails: React.FC<IDropHomeDetails> = ({
  title,
  data,
  isUpcoming,
}) => {
  return (
    <div className="drops_route-home">
      <h2>{title}</h2>
      {!data.length ? (
        <div style={{ display: "grid", placeItems: "center", height: 300 }}>
          <p>No data found</p>
        </div>
      ) : (
        <div className="card_wrapper">
          {data.map((d) => (
            <DropCard key={d.id} {...d} isUpcoming={isUpcoming} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropHomeDetails;
