import { ICoords } from "@/src/shared/lib/types";

export interface IGetNamazTimesPayload {
  coords: ICoords;
}

export interface IGetCurrentMonthNamazTimesPayload {
  coords: ICoords;
  month: number;
  year: number;
}

export interface IGetNamazTimesResponse {
  code: number;
  data: INamazData;
}

export interface IGetCurrentMonthNamazTimesResponse {
  code: number;
  data: INamazDataWithDate[];
}

export interface INamazData {
  timings: INamazTimings;
}

export interface INamazDataWithDate {
  timings: INamazTimings;
  date: {
    gregorian: {
      date: string;
      format: string;
    };
  };
}

export interface INamazTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
  Firstthird?: string;
  Lastthird?: string;
  Sunset?: string;
}
