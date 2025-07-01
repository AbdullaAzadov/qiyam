import {
  createSenderToNative,
  createWebviewListener,
} from "react-native-react-bridge/webview";
import { ICoords } from "./types";

export const sendToNative = createSenderToNative<TMessagesMap>();
export const {
  on: registerWebviewListener,
  off: unregisterWebviewListener,
  clear: clearWebviewListeners,
} = createWebviewListener<TMessagesMap>();

export type TMessagesMap = {
  getGeolocationRequest: null;
  getGeolocationResponse: ICoords;
  getStoreItemRequest: string;
  getStoreItemResponse: { key: string; value: any };
  setStoreItemRequest: { key: string; value: any };
  deleteStoreItemRequest: { key: string };
};
