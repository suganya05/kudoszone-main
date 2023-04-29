import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "api";
import {
  ICollectionData,
  ICollectionNft,
  ICollectionVolume,
} from "constants/types";

interface IAllCollection {
  latestCollection: ICollectionData[];
  topCollection: ICollectionData[];
}

interface IGetAllCollection {
  page?: number;
  limit?: number;
  qsort?: string;
}

interface IExploreCollections {
  data: ICollectionData[];
  hasNextPage: boolean;
  currentPage: number;
}

export const exploreApi = createApi({
  reducerPath: "exploreApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCollectionsVolume: builder.query<ICollectionVolume[], {}>({
      query: () => {
        return {
          url: "/volume",
        };
      },
    }),
    getExploreCollections: builder.query<
      IExploreCollections,
      IGetAllCollection
    >({
      query: ({ page, limit }) => {
        return {
          url: `/collections`,
          params: {
            page,
            limit,
          },
        };
      },
    }),
    getCollectionByAddress: builder.query<ICollectionData, string>({
      query: (address) => {
        return {
          url: `/collections/${address}`,
        };
      },
    }),
    getCollectionItemById: builder.query<ICollectionNft, string>({
      query: (id) => {
        return {
          url: `/collections/address/${id}`,
        };
      },
    }),
    getItemsByAddress: builder.query<
      ICollectionNft[],
      { address: string } & IGetAllCollection
    >({
      query: ({ address, page, qsort }) => {
        return {
          url: `/items/${address}`,
          params: {
            limit: 12,
            page,
            qsort,
          },
        };
      },
    }),
    getAllCollections: builder.query<IAllCollection, {}>({
      query: () => {
        return {
          url: `/top-collections`,
        };
      },
    }),
    getExploreRandomCollections: builder.query<
      ICollectionNft[],
      IGetAllCollection
    >({
      query: ({ page, qsort }) => {
        return {
          url: `/explore-collections`,
          params: {
            page,
            qsort,
          },
        };
      },
    }),
  }),
});

export const {
  useGetCollectionsVolumeQuery,
  useGetCollectionByAddressQuery,
  useGetItemsByAddressQuery,
  useGetAllCollectionsQuery,
  useGetCollectionItemByIdQuery,
  useGetExploreCollectionsQuery,
  useGetExploreRandomCollectionsQuery,
} = exploreApi;
