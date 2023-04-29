import React, { useContext } from "react";

import Button from "./Button";
import { WalletContext } from "store/context/WalletContext";

import "./Button/Button.scss";

const UnlockWallet: React.FC = () => {
  const { setOpenWallet } = useContext(WalletContext);

  return <Button onClick={() => setOpenWallet(true)}>Connect wallet</Button>;
};

export default UnlockWallet;
