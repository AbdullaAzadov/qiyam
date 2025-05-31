import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGetNamazTimesPayload, INamazResponse } from './types';

export const namazTimeApi = createApi({
  reducerPath: 'namazTimeApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  endpoints: (builder) => ({
    getNamazTimings: builder.query<INamazResponse, IGetNamazTimesPayload>({
      query: ({ coords: { latitude, longitude } }) =>
        `/api/praytime/coordinates?latitude=${latitude}&longitude=${longitude}`,
    }),
  }),
});

export const { useGetNamazTimingsQuery } = namazTimeApi;
