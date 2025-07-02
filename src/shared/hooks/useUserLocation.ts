"use client";
import { useEffect, useState } from "react";
import { getCurrentCoords } from "@/src/adapters/address/addressService";
import { useAppDispatch, useAppSelector } from "@/src/app/store";
import { setUserCoords, setUserCoordsLabel } from "../slices/userLocationSlice";
import { useLazyReverseGeocodeQuery } from "../api/addressApi";
import { ICoords } from "../lib/types";
import storageAdapter from "@/src/adapters/storage/storageService";
import { LS_KEY_COORDS, LS_KEY_COORDS_LABEL } from "../lib/consts";

export function useUserLocation() {
  const [fetchReverseGeocode, { isLoading: isLoadingReverseGeocode }] =
    useLazyReverseGeocodeQuery();
  const { coords, coordsLabel } = useAppSelector((state) => state.userLocation);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(isLoadingReverseGeocode);
  const [error, setError] = useState<string | null>(null);

  function setCoords(coords: ICoords) {
    dispatch(setUserCoords(coords));
    storageAdapter.setItem(LS_KEY_COORDS, coords);
  }

  function setCoordsLabel(coordsLabel: string) {
    dispatch(setUserCoordsLabel(coordsLabel));
    storageAdapter.setItem(LS_KEY_COORDS_LABEL, coordsLabel);
  }

  useEffect(() => {
    setIsLoading(isLoadingReverseGeocode);
  }, [isLoadingReverseGeocode]);

  const fetchCoords = async () => {
    setIsLoading(true);
    setError(null);

    const res = await getCurrentCoords();

    if (res) {
      setCoords(res);
      try {
        const label = await fetchReverseGeocode(res).unwrap();
        if (label) setCoordsLabel(label);
      } catch (e) {
        console.warn("Ошибка получения адреса:", e);
      }
    } else {
      const savedCoords = await storageAdapter.getItem<ICoords>(LS_KEY_COORDS);
      const savedLabel = await storageAdapter.getItem<string>(
        LS_KEY_COORDS_LABEL
      );

      if (savedCoords && savedLabel) {
        setCoords(savedCoords);
        setCoordsLabel(savedLabel);
      } else {
        setError("Не удалось получить координаты");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoords();
  }, []);

  return {
    coords,
    coordsLabel,
    isLoading,
    error,
    refetch: fetchCoords,
    setCoords,
    setCoordsLabel,
  };
}
