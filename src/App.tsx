import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { useMoralis } from "react-moralis";
import { Route, Routes } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

import { Footer, Header } from "./components";
import {
  Explore,
  Home,
  Create,
  Drops,
  Profile,
  Collections,
  CollectionDetails,
  PageNotFound,
  Stake,
  NftDetailsPage,
} from "./pages";

const App: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [openBanner, setOpenBanner] = useState(true);
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId") as any;
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3({ provider: connectorId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.body.className = "dark";
    } else {
      document.body.className = "light";
    }
  }, [isDarkMode]);

  return (
    <div className={openBanner ? "app add" : "app remove"}>
      <SkeletonTheme
        baseColor={isDarkMode ? "#0a0a0a" : "#eeeeee"}
        highlightColor={isDarkMode ? "#252525" : "#f5f5f5"}
      >
        <Header openBanner={openBanner} setOpenBanner={setOpenBanner} />
        <Routes>
          <Fragment>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/drops/*" element={<Drops />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/stake/*" element={<Stake />} />
            <Route
              path="/collections/:address"
              element={<CollectionDetails />}
            />
            <Route
              path="/collections/:address/:id"
              element={<NftDetailsPage />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Fragment>
        </Routes>
        <Footer />
      </SkeletonTheme>
    </div>
  );
};

export default App;
