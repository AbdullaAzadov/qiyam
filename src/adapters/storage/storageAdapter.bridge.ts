"use client";
import {
  registerWebviewListener,
  sendToNative,
  TMessagesMap,
  unregisterWebviewListener,
} from "@/src/shared/lib/bridge";
import { IStorageService } from "./storageService";

export const storageAdapterBridge: IStorageService = {
  getItem<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      sendToNative("getStoreItemRequest", key);
      const handler = (data: TMessagesMap["getStoreItemResponse"]) => {
        unregisterWebviewListener("getStoreItemResponse", handler);
        resolve(data.value);
      };

      registerWebviewListener("getStoreItemResponse", handler);
    });
  },

  setItem<T>(key: string, value: T) {
    sendToNative("setStoreItemRequest", { key, value });
  },

  removeItem(key: string) {
    sendToNative("deleteStoreItemRequest", { key });
  },
};
