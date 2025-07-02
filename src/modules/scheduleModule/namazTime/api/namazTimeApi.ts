import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IGetCurrentMonthNamazTimesPayload,
  IGetCurrentMonthNamazTimesResponse,
  IGetNamazTimesPayload,
  IGetNamazTimesResponse,
} from "./types";
import { getBaseUrl } from "@/src/shared/lib/consts";

export const namazTimeApi = createApi({
  reducerPath: "namazTimeApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: (builder) => ({
    getNamazTimings: builder.query<
      IGetNamazTimesResponse,
      IGetNamazTimesPayload
    >({
      query: ({ coords: { latitude, longitude } }) =>
        `/api/praytime/today?latitude=${latitude}&longitude=${longitude}`,
    }),
    getCurrentMonthNamazTimings: builder.query<
      IGetCurrentMonthNamazTimesResponse,
      IGetCurrentMonthNamazTimesPayload
    >({
      query: ({ coords: { latitude, longitude }, month, year }) =>
        `/api/praytime/month?latitude=${latitude}&longitude=${longitude}&month=${month}&year=${year}`,
    }),
  }),
});

export const { useGetNamazTimingsQuery, useGetCurrentMonthNamazTimingsQuery } =
  namazTimeApi;
