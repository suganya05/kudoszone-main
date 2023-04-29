import React, { ReactNode } from "react";

import TransactionContextProvider from "./context/TransactionContext";
import UserContextProvider from "./context/UserContext";
import WalletContextProvider from "./context/WalletContext";

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TransactionContextProvider>
      <WalletContextProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </WalletContextProvider>
    </TransactionContextProvider>
  );
};

export default Provider;
