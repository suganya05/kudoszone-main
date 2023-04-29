import React, { Fragment, useMemo, useState } from "react";

import { Dropdown } from "components";
import { useGetCollectionsVolumeQuery } from "store/services/exploreApi";
import Item from "./Item";
// import {
//   MINT_CONTRACT_ADDRESS,
//   MINT_ERC1155_CONTRACT_ADDRESS,
// } from "utils/address";
// import { NETWORK } from "constants/index";

const categoryOne = ["all", "verified"];
const categoryThree = [
  { label: "Highest Total Vol", value: "highest_total_val" },
  { label: "Highest Total Vol Usdc", value: "highest_total_val_usdc" },
];

const Table: React.FC<{}> = () => {
  const { data } = useGetCollectionsVolumeQuery({});
  const result = data?.slice();
  const [limit, setLimit] = useState(20);
  const [filterByCategoryOne, setFilterByCategoryOne] = useState(
    categoryOne[0],
  );
  const [filterByCategoryThree, setFilterByCategoryThree] = useState(
    categoryThree[0],
  );

  const collectionData = useMemo(() => {
    if (result) {
      if (filterByCategoryThree.value === "highest_total_val") {
        return result.sort((a, b) => Number(b.crovol) - Number(a.crovol));
      }
      if (filterByCategoryThree.value === "highest_total_val_usdc") {
        return result.sort((a, b) => Number(b.usdcvol) - Number(a.usdcvol));
      }
      return result;
    }
    return [];
  }, [result, filterByCategoryThree]);

  const renderFilters = (
    <Fragment>
      <div className="collections_filters-controls">
        {categoryOne.map((c) => (
          <button
            key={c}
            className={filterByCategoryOne === c ? "active" : undefined}
            onClick={() => setFilterByCategoryOne(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <Dropdown
        list={categoryThree}
        handleChange={(val) => setFilterByCategoryThree(val)}
      />
    </Fragment>
  );

  if (!collectionData) return null;

  return (
    <div>
      <div className="collections_filters">{renderFilters}</div>
      <div className="table_container">
        <table>
          <thead>
            <tr>
              <th>Collection</th>
              <th>Floor</th>
              <th>Total Vol</th>
              <th>Vol Usdc</th>
              <th>Owners</th>
            </tr>
          </thead>
          <tbody>
            {/* <Item
              index={0}
              _id="62e7860e7c08ee098464e96a"
              address={MINT_CONTRACT_ADDRESS[NETWORK]}
              holders="0"
              name="Kudoszone"
              createdAt={new Date()}
              updatedAt={new Date()}
              crovol="0"
              usdcvol="0"
            />
            <Item
              index={2}
              _id="62e7860e7c08ee098464e96b"
              address={MINT_ERC1155_CONTRACT_ADDRESS[NETWORK]}
              holders="0"
              name="Kudoszone"
              createdAt={new Date()}
              updatedAt={new Date()}
              crovol="0"
              usdcvol="0"
            /> */}
            {collectionData.slice(0, limit).map((collection, i) => (
              <Item key={collection._id} index={i + 3} {...collection} />
            ))}
          </tbody>
        </table>
      </div>
      {collectionData.length > limit && (
        <div className="collection_pagination">
          <p onClick={() => setLimit((l) => l + 20)}>View more</p>
        </div>
      )}
    </div>
  );
};

export default Table;
