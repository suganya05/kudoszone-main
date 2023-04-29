import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { Buffer } from "buffer";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { wagmiClient, chains, projectId } from "./utils/Connector/Connector";
import { EthereumClient } from "@web3modal/ethereum";
import "./index.scss";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App";
import Provider from "./store/Provider";
import store from "./store";

const ethereumClient = new EthereumClient(wagmiClient, chains);

window.Buffer = Buffer;

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL} initializeOnMount>
      <BrowserRouter>
        <WagmiConfig client={wagmiClient}>
          <ReduxProvider store={store}>
            <Provider>
              <App />
            </Provider>
          </ReduxProvider>
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
