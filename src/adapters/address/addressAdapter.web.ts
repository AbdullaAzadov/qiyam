"use client";
import { ICoords } from "@/src/shared/lib/types";
import { IAddressService } from "./addressService";

export const addressAdapterWeb: IAddressService = {
  async getGeolocation(): Promise<ICoords | null> {
    if (!navigator.geolocation) {
      console.error("Геолокация не поддерживается");
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
          resolve(null);
        }
      );
    });
  },
};
