import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface IGeoResponse {
  latitude: number;
  longitude: number;
  city?: string;
  locality?: string;
}

export const geocodeApi = createApi({
  reducerPath: 'geocodeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.bigdatacloud.net/data/' }),
  endpoints: (build) => ({
    reverseGeocode: build.query<
      string,
      { latitude: number; longitude: number }
    >({
      query: ({ latitude, longitude }) =>
        `reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`,
      transformResponse: (response: IGeoResponse) => {
        const { latitude: lat, longitude: lon, city, locality } = response;

        const isSairam =
          lat >= 42.3 && lat <= 42.31 && lon >= 69.75 && lon <= 69.77;
        if (isSairam) {
          return 'Сайрам';
        }
        return city || locality || 'Неизвестно';
      },
    }),
  }),
});

export const { useReverseGeocodeQuery } = geocodeApi;
