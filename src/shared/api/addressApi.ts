import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../lib/consts";

interface IGeoResponse {
  latitude: number;
  longitude: number;
  city?: string;
  locality?: string;
}

export interface IGeoSearchResponse {
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  osm_type: string;
  category: string;
  address: {
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
  }),
  endpoints: (build) => ({
    reverseGeocode: build.query<
      string,
      { latitude: number; longitude: number }
    >({
      query: ({ latitude, longitude }) =>
        `/api/address/reverse-geocode?latitude=${latitude}&longitude=${longitude}`,
      transformResponse: (response: IGeoResponse) => {
        const { latitude: lat, longitude: lon, city, locality } = response;

        const isSairam =
          lat >= 42.3 && lat <= 42.31 && lon >= 69.75 && lon <= 69.77;
        if (isSairam) {
          return "Сайрам";
        }
        return city || locality || "Неизвестно";
      },
    }),
    searchCityByName: build.query<
      IGeoSearchResponse[],
      { q: string; limit?: number }
    >({
      query: ({ q, limit }) =>
        `/api/address/search-by-name?q=${q.trim()}&limit=${limit ?? 8}`,
      transformResponse: (response: IGeoSearchResponse[]) => {
        const priority = ["kz", "uz", "kg", "ru"];

        const uniqueMap = new Map<string, IGeoSearchResponse>();
        response.forEach((item) => {
          const key = `${item.name}-${item.address.city}-${item.address.country}`;
          const isValid =
            item.osm_type === "relation" &&
            item.display_name !== item.address.country;

          if (!uniqueMap.has(key) && isValid) {
            uniqueMap.set(key, item);
          }
        });
        const uniqueResponse = Array.from(uniqueMap.values());

        return uniqueResponse.sort((a, b) => {
          const aCode = a.address.country_code?.toLowerCase() || "";
          const bCode = b.address.country_code?.toLowerCase() || "";

          const aIndex = priority.indexOf(aCode);
          const bIndex = priority.indexOf(bCode);

          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }

          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;

          return 0;
        });
      },
    }),
  }),
});

export const {
  useReverseGeocodeQuery,
  useLazyReverseGeocodeQuery,
  useSearchCityByNameQuery,
} = addressApi;
