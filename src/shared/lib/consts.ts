"use client";
import { ICoords } from "./types";

export const TIMEZONE = "Asia/Almaty";
export const DEFAULT_COORDS_LABEL = "Алма-Ата";

export const LS_KEY_COORDS = "userCoords";
export const LS_KEY_COORDS_LABEL = "userCoordsLabel";

export const NAMAZ_TIMES_NAMES = ["Фаджр", "Зухр", "Аср", "Магриб", "Иша"];

export const DEFAULT_COORDS: ICoords = {
  latitude: 43.238949,
  longitude: 76.889709,
};

export const INVALID_COORDS: ICoords = {
  latitude: 0,
  longitude: 0,
};

export const SAYRAM_COORDS: ICoords = {
  latitude: 42.3041909500941,
  longitude: 69.75986478320661,
};

export const AQTAU_COORDS: ICoords = {
  latitude: 43.693695,
  longitude: 51.260834,
};

export const KAABA_COORDS: ICoords = {
  latitude: 21.4225,
  longitude: 39.8262,
};

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Клиент
    return `${window.location.protocol}//${window.location.host}/`;
  }

  // Сервер (SSR, например, при пререндере)
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";
}
