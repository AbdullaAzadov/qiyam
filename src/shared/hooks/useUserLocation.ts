'use client';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  setUserCoords,
  setUserCoordsLabel,
  resetUserLocation,
} from '@/src/shared/model/slices/userLocationSlice';
import { useAppSelector } from '@/src/app/store';
import { LS_KEY_COORDS, LS_KEY_COORDS_LABEL } from '../lib/consts';
import { ICoords } from '../lib/types';

export function useUserLocation() {
  const dispatch = useDispatch();
  const userCoords = useAppSelector((state) => state.userLocation.coords);
  const userCoordsLabel = useAppSelector(
    (state) => state.userLocation.coordsLabel
  );

  useEffect(() => {
    const coordsRaw = localStorage.getItem(LS_KEY_COORDS);
    const label = localStorage.getItem(LS_KEY_COORDS_LABEL);

    if (coordsRaw) {
      try {
        const parsed = JSON.parse(coordsRaw);
        if (parsed.lat && parsed.lon) {
          dispatch(setUserCoords(parsed));
        }
      } catch (err) {
        console.warn('Failed to parse userCoords from LS' + err);
      }
    }

    if (label) {
      dispatch(setUserCoordsLabel(label));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userCoords) {
      localStorage.setItem(LS_KEY_COORDS, JSON.stringify(userCoords));
    }
    if (userCoordsLabel) {
      localStorage.setItem(LS_KEY_COORDS_LABEL, userCoordsLabel);
    }
  }, [userCoords, userCoordsLabel]);

  const setCoords = (coords: ICoords) => {
    dispatch(setUserCoords(coords));
  };

  const setLabel = (label: string) => {
    dispatch(setUserCoordsLabel(label));
  };

  const reset = () => {
    localStorage.removeItem(LS_KEY_COORDS);
    localStorage.removeItem(LS_KEY_COORDS_LABEL);
    dispatch(resetUserLocation());
  };

  return {
    userCoords,
    userCoordsLabel,
    setCoords,
    setLabel,
    reset,
  };
}
