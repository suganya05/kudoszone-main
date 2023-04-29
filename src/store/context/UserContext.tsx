import React, { createContext, ReactNode } from "react";
import { useGetUserDetails } from "hooks";

export interface IUser {
  tokens: {
    tokenAddress: string;
    allowance: number;
    balance: number;
    symbol: string;
    isErc721Approved: boolean;
    isErc1155Approved: boolean;
  }[];
}

interface IUserContext {
  loading: boolean;
  error: Error | string | null;
  data: IUser;
}

export const UserContext = createContext<IUserContext>({
  loading: false,
  error: null,
  data: { tokens: [] },
});

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { loading, error, data } = useGetUserDetails();

  return (
    <UserContext.Provider value={{ loading, error, data }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
