import { ICoords } from '@/src/shared/lib/types';

export interface IGetNamazTimesPayload {
  coords: ICoords;
}

export interface INamazResponse {
  code: number;
  data: INamazData;
}

export interface INamazData {
  timings: INamazTimings;
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
