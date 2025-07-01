"use client";
import { IStorageService } from "./storageService";

export const storageAdapterWeb: IStorageService = {
  getItem<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return Promise.resolve(null);

      try {
        return Promise.resolve(JSON.parse(item));
      } catch {
        return Promise.resolve(item as unknown as T);
      }
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem<T>(key: string, value: T) {
    try {
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch {}
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
};
