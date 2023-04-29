import React from "react";

import "./Collections.scss";
import Table from "./Table";

const Collections: React.FC<{}> = () => {
  return (
    <div className="collections">
      <div className="mx pad">
        <h2>Collections</h2>
        <Table />
      </div>
    </div>
  );
};

export default Collections;
