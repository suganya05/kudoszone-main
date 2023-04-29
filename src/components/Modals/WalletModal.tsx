import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMoralis } from "react-moralis";

import "./Modal.scss";
import Backdrop from "./Backdrop";

import metamaskLogo from "../../assets/images/metamask.png";
import walletconnectLogo from "../../assets/images/walletconnect.png";
import { modalVaraints } from "../../constants/variants";
import ModalHeader from "./ModalHeader";

interface IWalletModal {
  modal: boolean;
  handleClose: () => void;
}

const WalletModal: React.FC<IWalletModal> = ({ modal, handleClose }) => {
  const { authenticate } = useMoralis();

  const handleConnect = async (connector: any) => {
    try {
      await authenticate({ provider: connector });
      window.localStorage.setItem("connectorId", connector);
      handleClose();
    } catch (error) {}
  };

  return (
    <Backdrop handleClose={handleClose} isOpen={modal}>
      <AnimatePresence exitBeforeEnter>
        {modal && (
          <motion.div
            className={"modal wallet_modal"}
            onClick={(e) => e.stopPropagation()}
            variants={modalVaraints}
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <div className="wallet_modal-content">
              <ModalHeader
                title="Connect to a wallet"
                handleClose={handleClose}
              />
              <div className="wallet_wrapper">
                <div
                  className="wallet_wrapper-card"
                  onClick={() => handleConnect("metamask")}
                >
                  <img src={metamaskLogo} alt="metamask logo" />
                  <p>Metamask</p>
                </div>
                <div
                  className="wallet_wrapper-card"
                  onClick={() => handleConnect("walletconnect")}
                >
                  <img src={walletconnectLogo} alt="wallet connect logo" />
                  <p>WalletConnect</p>
                </div>
              </div>
              <p>
                By connecting your wallet, you agree to our{" "}
                <a
                  style={{ fontFamily: "grold-regular" }}
                  href="terms-of-service"
                >
                  Terms of Service
                </a>{" "}
                and our{" "}
                <a
                  style={{ fontFamily: "grold-regular" }}
                  href="privacy-policy"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Backdrop>
  );
};

export default WalletModal;
