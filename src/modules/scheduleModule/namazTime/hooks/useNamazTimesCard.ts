"use client";
import { useUserLocation } from "@/src/shared/hooks/useUserLocation";
import {
  useGetCurrentMonthNamazTimingsQuery,
  useGetNamazTimingsQuery,
} from "../api/namazTimeApi";
import { IGeoSearchResponse } from "@/src/shared/api/addressApi";

const month = new Date().getMonth() + 1; // Get current month (1-12)
const year = new Date().getFullYear(); // Get current year

export const useNamazTimesCard = () => {
  const {
    coords,
    coordsLabel,
    isLoading: isLoadingCoords,
    refetch: refetchCoords,
    setCoords,
    setCoordsLabel,
  } = useUserLocation();

  const {
    data: timingsData,
    isFetching: isTimingsFetching,
    isSuccess,
  } = useGetNamazTimingsQuery({ coords: coords! }, { skip: !coords });

  const { data: monthTimingsData, isFetching: isMonthTimingsFetching } =
    useGetCurrentMonthNamazTimingsQuery(
      { coords: coords!, month, year },
      { skip: !coords }
    );

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
    monthTimingsData,
    isMonthTimingsFetching,
  };
};
