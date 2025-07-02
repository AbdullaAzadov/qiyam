"use client";
import { ICoords } from "@/src/shared/lib/types";
import {
  registerWebviewListener,
  sendToNative,
  unregisterWebviewListener,
} from "@/src/shared/lib/bridge";
import { IAddressService } from "./addressService";

export const addressAdapterBridge: IAddressService = {
  async getGeolocation(): Promise<ICoords | null> {
    return new Promise((resolve) => {
      sendToNative("getGeolocationRequest", null);
      const handler = (coords: ICoords) => {
        unregisterWebviewListener("getGeolocationResponse", handler);
        resolve(coords);
      };

      registerWebviewListener("getGeolocationResponse", handler);
    });
  },
};
