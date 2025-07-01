"use client";

function detectIsWebView(): boolean {
  const hasWindow = typeof window !== "undefined";
  const hasNativeBridge =
    hasWindow && "ReactNativeWebView" in window && !!window.ReactNativeWebView;
  const isForcedParam =
    hasWindow && window.location.search.includes("webview=true");
  return hasNativeBridge || isForcedParam;
}

export const isWebView = detectIsWebView();

import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "./consts";

export function getZonedTime(iso: string) {
  return toZonedTime(parseISO(iso), TIMEZONE).getTime();
}

export function getUserLocation(
  onSuccess: (coords: { latitude: number; longitude: number }) => void,
  onError?: (error: GeolocationPositionError) => void
) {
  if (!navigator.geolocation) {
    onError?.({
      code: 0,
      message: "Геолокация не поддерживается",
    } as GeolocationPositionError);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      onError?.(error);
    }
  );
}
