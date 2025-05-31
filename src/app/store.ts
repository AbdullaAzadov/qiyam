import { configureStore } from '@reduxjs/toolkit';
import { namazTimeApi } from '../features/namazTime/api/slice';
import userLocationReducer from '@/src/shared/model/slices/userLocationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { geocodeApi } from '../shared/api/geocodeApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      userLocation: userLocationReducer,
      [namazTimeApi.reducerPath]: namazTimeApi.reducer,
      [geocodeApi.reducerPath]: geocodeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(namazTimeApi.middleware)
        .concat(geocodeApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
