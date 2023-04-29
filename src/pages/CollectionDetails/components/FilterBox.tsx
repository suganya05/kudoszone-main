import React, { useState } from "react";

interface IFilterBoxProps {
  toggleBuyNow: boolean;
  setToggleBuyNow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterBox: React.FC<IFilterBoxProps> = ({
  toggleBuyNow,
  setToggleBuyNow,
}) => {
  return (
    <div>
      <div className="flex-between">
        <p>Buy now</p>
        <div
          onClick={() => setToggleBuyNow((t) => !t)}
          className={toggleBuyNow ? "radio active" : "radio"}
        ></div>
      </div>
    </div>
  );
};

export default FilterBox;
