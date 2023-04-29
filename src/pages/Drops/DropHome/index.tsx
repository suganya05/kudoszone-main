import { CardLoader } from "components";
import {
  getActiveDrops,
  getCompletedDrops,
  getUpcomingDrops,
} from "helpers/methods";
import React, { useEffect } from "react";
import { useGetDropsApiQuery } from "store/services/dropsApi";
import DropHomeDetails from "./DropHomeDetails";

const DropHome: React.FC<{}> = () => {
  const { data } = useGetDropsApiQuery({});

  useEffect(() => {
    if (data) getCompletedDrops(data);
  }, [data]);

  if (!data)
    return (
      <div className="mx pad pt-50 pb-50">
        <CardLoader />
      </div>
    );

  return (
    <div className="drops_route">
      <div className="mx pad">
        <DropHomeDetails title="Active Drops" data={getActiveDrops(data)} />
        <DropHomeDetails
          title="Completed Drops"
          data={getCompletedDrops(data)}
        />
        <DropHomeDetails
          title="Upcoming Drops"
          isUpcoming={true}
          data={getUpcomingDrops(data)}
        />
      </div>
    </div>
  );
};

export default DropHome;
