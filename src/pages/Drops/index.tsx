import React from "react";
import { Route, Routes } from "react-router-dom";

import "./Drops.scss";
import DropDetails from "./DropDetails";
import DropHome from "./DropHome";

const Drops: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<DropHome />} />
      <Route path="/:collection" element={<DropDetails />} />
    </Routes>
  );
};

export default Drops;
