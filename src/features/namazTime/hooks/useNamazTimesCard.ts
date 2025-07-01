"use client";
import { useUserLocation } from "@/src/shared/hooks/useUserLocation";
import { useGetNamazTimingsQuery } from "../api/namazTimeApi";
import { IGeoSearchResponse } from "@/src/shared/api/addressApi";

export const useNamazTimesCard = () => {
  const {
    coords,
    coordsLabel,
    isLoading: isLoadingCoords,
    refetch: refetchCoords,
    setCoords,
    setCoordsLabel,
  } = useUserLocation();

  console.log(coords);

  const {
    data: timingsData,
    isFetching: isTimingsFetching,
    isSuccess,
  } = useGetNamazTimingsQuery({ coords: coords! }, { skip: !coords });

  const timings = isSuccess
    ? timingsData.data.timings
    : timingsData?.data.timings;

  const namazTimes = [
    {
      label: "Фаджр",
      time: timings?.Fajr,
      subTime: timings?.Sunrise,
      subTimeLabel: "Восход",
    },
    { label: "Зухр", time: timings?.Dhuhr },
    { label: "Аср", time: timings?.Asr },
    { label: "Магриб", time: timings?.Maghrib },
    { label: "Иша", time: timings?.Isha },
  ];

  const handleChangeCoords = async () => {
    await refetchCoords();
  };

  const handleLocationSelect = (location: IGeoSearchResponse) => {
    setCoords({ latitude: +location.lat, longitude: +location.lon });
    setCoordsLabel(location.name);
  };

  return {
    isLoadingCoords,
    timings,
    namazTimes,
    handleChangeCoords,
    coordsLabel,
    isTimingsFetching,
    handleLocationSelect,
  };
};
