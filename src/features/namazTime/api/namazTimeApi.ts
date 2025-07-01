import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IGetNamazTimesPayload, INamazResponse } from "./types";
import { getBaseUrl } from "@/src/shared/lib/consts";

export const namazTimeApi = createApi({
  reducerPath: "namazTimeApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: (builder) => ({
    getNamazTimings: builder.query<INamazResponse, IGetNamazTimesPayload>({
      query: ({ coords: { latitude, longitude } }) =>
        `/api/praytime/coordinates?latitude=${latitude}&longitude=${longitude}`,
    }),
  }),
});

export const { useGetNamazTimingsQuery } = namazTimeApi;
