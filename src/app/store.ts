import { configureStore } from "@reduxjs/toolkit";
import { namazTimeApi } from "../modules/scheduleModule/namazTime/api/namazTimeApi";
import userLocationReducer from "@/src/shared/slices/userLocationSlice";
import { useDispatch, useSelector } from "react-redux";
import { addressApi } from "../shared/api/addressApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      userLocation: userLocationReducer,
      [namazTimeApi.reducerPath]: namazTimeApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(namazTimeApi.middleware)
        .concat(addressApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
