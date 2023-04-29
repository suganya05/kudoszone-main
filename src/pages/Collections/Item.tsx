import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import { ReactComponent as Verified } from "assets/icons/verified.svg";
import { ReactComponent as Gallery } from "assets/icons/gallery.svg";
import { useGetCollectionByAddressQuery } from "store/services/exploreApi";
import { ICollectionVolume } from "constants/types";
import { n6 } from "helpers/formatters";

interface ItemProps extends ICollectionVolume {
  index: number;
}

const Image: React.FC<{ img: string | null | undefined; name: string }> = ({
  img,
  name,
}) => {
  const [isError, setIsError] = useState(false);

  // if (!img)
  //   return (
  //     <div className="no_image">
  //       <Skeleton height={"40px"} />
  //     </div>
  //   );

  if (isError)
    return (
      <div className="no_image">
        <Gallery width={40} height={40} />
      </div>
    );

  return <img src={img} onError={() => setIsError(true)} alt={name} />;
};

const Item: React.FC<ItemProps> = ({ address, index }) => {
  const navigate = useNavigate();
  const { data, isError } = useGetCollectionByAddressQuery(address);

  if (isError) return null;

  return (
    <tr onClick={() => navigate(`/collections/${data?.contract_address}`)}>
      <td className="collection-name">
        <div className="flex">
          <strong>#{index + 1}</strong>
          <Image img={data?.img} name={data?.name} />
          <p className="flex g-5">
            <span>{!data ? <Skeleton /> : data.name}</span>
            {data?.isVerified && <Verified />}
          </p>
        </div>
      </td>
      <td>
        <div className="flex g-8">
          <CronosIcon className="cronos" />
          <span>
            {!data ? <Skeleton /> : n6.format(data.crofloor / 10 ** 18)}
          </span>
        </div>
      </td>
      <td>
        <div className="flex g-8">
          <CronosIcon className="cronos" />
          <span>{!data ? <Skeleton /> : data.volcro}</span>
        </div>
      </td>
      <td>
        <div className="flex g-8">
          <span>
            {!data ? (
              <Skeleton />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(Number(data.volusdc))
            )}
          </span>
        </div>
      </td>
      <td>{!data ? <Skeleton /> : data.owners}</td>
    </tr>
  );
};

export default Item;
