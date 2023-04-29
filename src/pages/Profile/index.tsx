import React from "react";
import { useMoralis } from "react-moralis";
import { NavLink, Route, Routes } from "react-router-dom";

import "./Profile.scss";
import { Button, CopyText } from "components";
import { getEllipsisTxt } from "helpers/formatters";

import heroImage from "assets/abstracts/card.png";
import bg from "assets/abstracts/bg.png";
import { ReactComponent as ShareIcon } from "assets/icons/share.svg";
import MyNfts from "./MyNfts";
import OnSaleNfts from "./OnSaleNfts";
import {
  MINT_CONTRACT_ADDRESS,
  MINT_ERC1155_CONTRACT_ADDRESS,
} from "utils/address";
import Erc1155Nfts from "./Erc1155Nfts";
import { NETWORK } from "constants/index";

const profileLinks = [
  {
    name: "On sale",
    link: "/profile/",
  },
  {
    name: "My Nfts ERC-721",
    link: "/profile/mynfts-erc721",
  },
  {
    name: "My Nfts ERC-1155",
    link: "/profile/mynfts-erc1155",
  },
];

const Profile: React.FC<{}> = () => {
  const { account, isInitialized, isAuthenticated, chainId } = useMoralis();

  if (!isInitialized || !isAuthenticated || !account || !chainId) return null;

  const renderProfile = (
    <div className="profile_route-details">
      <div className="banner">
        <img src={bg} alt="banner" />
      </div>
      <div className="mx pad">
        <div className="user_details">
          <img className="avatar" src={heroImage} alt="avatar" />
          <div className="flex g-16">
            <div className="flex g-5">
              <p>{getEllipsisTxt(account)}</p>
              <CopyText text={account} />
            </div>
            <p>Joined July 2022 </p>
          </div>
          <div className="controls">
            <Button variant="secondary">
              <span>Share</span>
              <ShareIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile_route">
      {renderProfile}
      <div className="profile_pages">
        <div className="mx pad">
          <nav className="profile_pages-links mb-40">
            {profileLinks.map((path, i) => (
              <NavLink key={i.toString()} to={`${path.link}`}>
                {path.name}
              </NavLink>
            ))}
          </nav>
          <Routes>
            <Route path="/" element={<OnSaleNfts />} />
            <Route
              path="/mynfts-erc721"
              element={
                <MyNfts
                  address={account}
                  contractaddress={MINT_CONTRACT_ADDRESS[NETWORK]}
                />
              }
            />
            <Route
              path="/mynfts-erc1155"
              element={
                <Erc1155Nfts
                  account={account}
                  contractaddress={MINT_ERC1155_CONTRACT_ADDRESS[NETWORK]}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
