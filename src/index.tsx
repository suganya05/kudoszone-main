import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider as ReduxProvider } from "react-redux";

import "./index.scss";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App";
import Provider from "./store/Provider";
import store from "./store";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL} initializeOnMount>
      <BrowserRouter>
        <ReduxProvider store={store}>
          <Provider>
            <App />
          </Provider>
        </ReduxProvider>
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
