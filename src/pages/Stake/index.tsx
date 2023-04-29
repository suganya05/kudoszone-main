import React from "react";
import StakeDetails from "./components/StakeDetails";
import Stats from "./components/Stats";

import "./Stake.scss";

const Stake: React.FC<{}> = () => {
  return (
    <div className="stake_route">
      <div className="mx pad">
        <div className="stake_route-container">
          <div className="stake_route-container_header">
            <div className="flex-center g-10">
              <h1>Stake</h1>
              <h1 className="primary">NFTS</h1>
            </div>
            <p>Stake your NFTs to Earn Tokens, risk-free income.</p>
          </div>
          <Stats />
          <StakeDetails />
        </div>
      </div>
    </div>
  );
};

export default Stake;
