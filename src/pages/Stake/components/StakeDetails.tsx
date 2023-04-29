import React from "react";
// import { useMoralis } from "react-moralis";
// import StakingCard from "./StakingCard";

const StakeDetails: React.FC = () => {
  // const { isAuthenticated } = useMoralis();

  return (
    <div className="staking-card_wrapper">
      <div className="promise_error" style={{ minHeight: "100px" }}>
        <p>No data found</p>
      </div>
      {/* <StakingCard
        contractaddress="0xa589A42D4a27b4F01B993e43D8364D38E69B7578"
        address={account}
      /> */}
    </div>
  );
};

export default StakeDetails;
