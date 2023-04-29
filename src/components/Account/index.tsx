import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

import "./Account.scss";
import { Backdrop } from "components/Modals";
import { useGetUser, useLockedBody, useUpdateEffect } from "hooks";
import { ReactComponent as CronosIcon } from "assets/icons/cronos.svg";
import Button from "components/Button";
import { getEllipsisTxt, n6 } from "helpers/formatters";
import heroImage from "assets/abstracts/card.png";
import CopyText from "components/CopyText";

interface IAccount {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Account: React.FC<IAccount> = ({ isOpen, setIsOpen }) => {
  const handleClose = () => setIsOpen(false);
  const { setLocked } = useLockedBody();
  const { account, logout } = useMoralis();
  const { data, loading } = useGetUser();
  const navigate = useNavigate();

  useUpdateEffect(() => {
    if (isOpen) return setLocked(true);
    return setLocked(false);
  }, [isOpen]);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/", { replace: true });
  };

  const renderMyProfile = (
    <div className="account_sidebar-box_profile">
      <img src={heroImage} alt="avatar" className="avatar" />
      <div className="flex g-10">
        <p>{getEllipsisTxt(account)}</p>
        <CopyText text={account} />
      </div>
      <p style={{ fontSize: "10px" }}>Connected with MetaMask</p>
    </div>
  );

  const renderMyLinks = (
    <div className="account_sidebar-box_links">
      <Link to="/profile">My Collections</Link>
      <Link to="/profile">My Profile</Link>
    </div>
  );

  const renderMyWallet = (
    <div className="account_sidebar-box_wallet">
      <p>My wallet</p>
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i.toString()} />
          ))
        : data.tokens?.map((token) => (
            <div key={token.tokenAddress} className="flex-between">
              <div className="flex g-5">
                <CronosIcon width={14} height={14} className="cronos" />
                {token.symbol}
              </div>
              <b>{n6.format(token.balance)}</b>
            </div>
          ))}
    </div>
  );

  const renderMyRewards = (
    <div className="account_sidebar-box_rewards">
      <p>My Rewards</p>
      <div className="flex-between">
        <div className="flex g-5">
          <CronosIcon width={14} height={14} className="cronos" />
          CRO
        </div>
        <b>0</b>
      </div>
      <div className="flex-between">
        <div className="flex g-5">
          <CronosIcon width={14} height={14} className="cronos" />
          CRO
        </div>
        <b>0</b>
      </div>
    </div>
  );

  return (
    <>
      <Backdrop isOpen={isOpen} handleClose={handleClose} />
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            className="account_sidebar"
            onClick={(e) => e.stopPropagation()}
            initial={{ width: 0 }}
            animate={{ width: 280, transition: { duration: 0.4 } }}
            exit={{ width: 0 }}
          >
            <div className="account_sidebar-box">
              {renderMyProfile}
              {renderMyLinks}
              {renderMyWallet}
              {renderMyRewards}
              <Button variant="error" onClick={() => handleLogout()}>
                Disconnect
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Account);
