import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "pending",
  nfts: [],
};

export const userNftsSlice = createSlice({
  name: "userErc721Nfts",
  initialState,
  reducers: {},
});
