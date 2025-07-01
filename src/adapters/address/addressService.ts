import { ICoords } from "@/src/shared/lib/types";
import { isWebView } from "@/src/shared/lib/utils";
import { addressAdapterBridge } from "./addressAdapter.bridge";
import { addressAdapterWeb } from "./addressAdapter.web";

export const addressAdapter: IAddressService = isWebView
  ? addressAdapterBridge
  : addressAdapterWeb;

export default addressAdapter;

export interface IAddressService {
  getGeolocation(): Promise<ICoords | null>;
}

export async function getCurrentCoords(): Promise<ICoords | null> {
  const res = await addressAdapter.getGeolocation();
  return res;
}
