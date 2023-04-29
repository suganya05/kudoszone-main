import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { exploreApi } from "./services/exploreApi";
import { dropsApi } from "./services/dropsApi";
import { userNftsSlice } from "./slices/userNftsSlice";

const store = configureStore({
  reducer: {
    [dropsApi.reducerPath]: dropsApi.reducer,
    [exploreApi.reducerPath]: exploreApi.reducer,
    userErc721Nft: userNftsSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
