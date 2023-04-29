import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "api/index";
import { IDropCollection } from "constants/types";

export const dropsApi = createApi({
  reducerPath: "dropsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getDropsApi: builder.query<IDropCollection[], {}>({
      query: () => {
        return {
          url: "/drops",
        };
      },
    }),
    getDropByIdApi: builder.query<IDropCollection, string>({
      query: (collection_slug) => {
        return {
          url: `/drops/${collection_slug}`,
        };
      },
    }),
  }),
});

export const { useGetDropsApiQuery, useGetDropByIdApiQuery } = dropsApi;
