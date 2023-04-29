import React, { useState } from "react";

import "./Explore.scss";
import Main from "./Main";
import { FilterLayout } from "components";
import ExploreCollection from "./ExploreCollection";

const collectionFilters = [
  { label: "Price: Low to high", value: "asc" },
  { label: "Price: High to low", value: "desc" },
];

const Explore: React.FC<{}> = () => {
  const [selectedFilter, setSelectedfilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="explore">
      <div className="mx pad">
        <FilterLayout
          dropdownFilter={collectionFilters}
          handleChangeInput={(val) => setSearchInput(val)}
          handleChangeDropdown={(val) => setSelectedfilter(val)}
          renderFilterBox={<ExploreCollection />}
          renderMain={
            <Main selectedFilter={selectedFilter} searchInput={searchInput} />
          }
          onMountOpenFilter={true}
        />
      </div>
    </div>
  );
};

export default Explore;
