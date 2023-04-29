import React, { Fragment, useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useChain, useMoralis } from "react-moralis";
import { AnimatePresence, motion } from "framer-motion";
import { useDarkMode } from "usehooks-ts";

import "./Header.scss";
import logo from "assets/logo/logo.png";
import wrongNetwork from "assets/icons/wrong_network.png";
import { ReactComponent as Menu } from "assets/icons/menu.svg";
import { ReactComponent as SunIcon } from "assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "assets/icons/moon.svg";
import { ReactComponent as DownArrow } from "assets/icons/down_arrow.svg";
import { ReactComponent as Close } from "assets/icons/close.svg";
import { WalletContext } from "store/context/WalletContext";
import { formatLinks, getEllipsisTxt } from "helpers/formatters";
import Button from "components/Button";
import Account from "components/Account";
import { Modal } from "components/Modals";
import {
  headerDropdownLinks,
  headerLinks,
  upcomingLinks,
} from "constants/links";
import { useLockedBody, useUpdateEffect } from "hooks";
import Sidebar from "./Sidebar";
import { NETWORK } from "constants/index";

const Header: React.FC<{
  setOpenBanner: React.Dispatch<React.SetStateAction<boolean>>;
  openBanner: boolean;
}> = ({ setOpenBanner, openBanner }) => {
  const { setOpenWallet } = useContext(WalletContext);
  const { isAuthenticated, account, isWeb3Enabled } = useMoralis();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { chainId, switchNetwork } = useChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { setLocked } = useLockedBody();
  const { toggle, isDarkMode } = useDarkMode();
  const { pathname } = useLocation();

  useUpdateEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useUpdateEffect(() => {
    if (isAuthenticated && isWeb3Enabled) {
      if (chainId && chainId !== NETWORK) {
        setIsWrongNetwork(true);
        return;
      }
      setIsWrongNetwork(false);
    }
  }, [isAuthenticated, isWeb3Enabled, chainId]);

  useUpdateEffect(() => {
    if (isWrongNetwork) return setLocked(true);
    return setLocked(false);
  }, [isWrongNetwork]);

  const renderNavigation = (
    <div className="navigation_controls">
      <nav>
        <NavLink to={`/`}>Home</NavLink>
        {headerLinks.map((link) => (
          <NavLink key={link} to={`/${formatLinks(link)}`}>
            {link}
          </NavLink>
        ))}
        <div
          onMouseEnter={() => setOpenDropdown(true)}
          onMouseLeave={() => setOpenDropdown(false)}
          className="header_dropdown"
        >
          <p className="header_dropdown-header flex g-5">
            <span>More</span>
            <DownArrow />
          </p>
          <AnimatePresence>
            {openDropdown && (
              <motion.ul
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.7 }}
                exit={{ opacity: 0 }}
                className="header_dropdown-lists"
              >
                {headerDropdownLinks.map((link) => (
                  <li key={link}>
                    <Link to={`/${formatLinks(link)}`}>{link}</Link>
                  </li>
                ))}
                {upcomingLinks.map((link, index) => (
                  <li key={index.toString()}>
                    <a
                      href="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.reload();
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <div className="theme-switcher" onClick={() => toggle()}>
        {isDarkMode ? <MoonIcon /> : <SunIcon />}
      </div>
      {isAuthenticated ? (
        <Button onClick={() => setIsOpen(true)}>
          {getEllipsisTxt(account)}
        </Button>
      ) : (
        <Button onClick={() => setOpenWallet(true)}>Connect</Button>
      )}
      <div className="hamburger" onClick={() => setSidebar(true)}>
        <Menu />
      </div>
    </div>
  );

  const renderBanner = (
    <div className="header_banner pad">
      <h2>Kudoszone platform is on beta version</h2>
      <div className="close" onClick={() => setOpenBanner(false)}>
        <Close />
      </div>
    </div>
  );

  return (
    <Fragment>
      <header className="header">
        {openBanner && renderBanner}
        <div className="header_wrapper pad">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          {renderNavigation}
        </div>
      </header>
      {isAuthenticated && <Account isOpen={isOpen} setIsOpen={setIsOpen} />}
      <Sidebar isOpen={sidebar} setIsOpen={setSidebar} />
      <Modal isOpen={isWrongNetwork} overlay={false}>
        <div className="wrong_network-modal">
          <img src={wrongNetwork} alt="wrong network" />
          <h2>Wrong network </h2>
          <p>
            Seems like you are connected to a wrong network. Connect to the
            cronos mainnet to continue
          </p>
          <Button onClick={() => switchNetwork(NETWORK)}>Switch Network</Button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default React.memo(Header);
