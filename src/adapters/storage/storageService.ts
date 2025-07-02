"use client";
import { isWebView } from "@/src/shared/lib/utils";
import { storageAdapterWeb } from "./storageAdapter.web";
import { storageAdapterBridge } from "./storageAdapter.bridge";

export const storageAdapter: IStorageService = isWebView
  ? storageAdapterBridge
  : storageAdapterWeb;

export default storageAdapter;

export interface IStorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}
