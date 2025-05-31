'use client';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/src/shared/cn/components/ui/card';
import { NavigationIcon } from 'lucide-react';
import { INamazTimings } from '../api/types';
import { useUserLocation } from '@/src/shared/hooks/useUserLocation';
import NamazTimeCardItem from './namazTimeCardItem';
import { getNearestNamazTime } from '../lib/utils';
import { useCurrentTime } from '@/src/shared/hooks/useCurrentTime';
import { getUserLocation } from '@/src/shared/lib/utils';
import { useGetNamazTimingsQuery } from '../api/namazTimeApi';
import {
  IGeoSearchResponse,
  useReverseGeocodeQuery,
} from '@/src/shared/api/addressApi';
import { useEffect } from 'react';
import { DEFAULT_COORDS } from '@/src/shared/lib/consts';
import UserGeolocation from '../../userGeolocation/ui/userGeolocation';
import CustomDialog from '@/src/shared/ui/customDialog';

type Props = {
  initialTimings?: INamazTimings;
};

export default function NamazTimeCard({ initialTimings }: Props) {
  const time = useCurrentTime();
  const {
    userCoords: { latitude, longitude },
    userCoordsLabel,
    setCoords,
    setLabel,
  } = useUserLocation();

  const {
    data: timingsData,
    isFetching: isTimingsFetching,
    isSuccess,
  } = useGetNamazTimingsQuery(
    { coords: { latitude, longitude } },
    { skip: initialTimings !== undefined }
  );

  const { data: addressLabel, isLoading: isAddressLoading } =
    useReverseGeocodeQuery(
      { latitude, longitude },
      {
        skip: initialTimings !== undefined,
      }
    );

  const timings = isSuccess
    ? timingsData.data.timings
    : initialTimings ?? timingsData?.data.timings;

  useEffect(() => {
    if (addressLabel && userCoordsLabel !== addressLabel) {
      setLabel(addressLabel);
    }
  }, [setLabel, userCoordsLabel, addressLabel]);

  const isLoading =
    isAddressLoading ||
    isTimingsFetching ||
    !timings ||
    isAddressLoading ||
    !time;

  const { nearestNamazLabel, remainingTimeToNearestNamaz } =
    getNearestNamazTime(timings, time);

  const namazTimes = [
    {
      label: 'Фаджр',
      time: timings?.Fajr,
      subTime: timings?.Sunrise,
      subTimeLabel: 'Восход',
    },
    { label: 'Зухр', time: timings?.Dhuhr },
    { label: 'Аср', time: timings?.Asr },
    { label: 'Магриб', time: timings?.Maghrib },
    { label: 'Иша', time: timings?.Isha },
  ];

  const handleChangeCoords = () => {
    getUserLocation(
      (coords) => {
        setCoords(coords);
      },
      (error) => {
        console.error('Ошибка получения геолокации:', error);
        setCoords(DEFAULT_COORDS);
      }
    );
  };

  const handleLocationSelect = (location: IGeoSearchResponse) => {
    setCoords({ latitude: +location.lat, longitude: +location.lon });
  };

  return (
    <Card className='p-0 overflow-hidden gap-0 relative'>
      <CardHeader className='p-0'>
        <div className='flex justify-between items-center px-4 pt-2'>
          <p className='text-foreground text-lg select-none'>Время намаза</p>
          <CustomDialog
            trigger={
              <p className='text-muted-foreground text-sm cursor-pointer select-none'>
                {userCoordsLabel}{' '}
                <NavigationIcon className='size-3 inline fill-muted text-muted' />
              </p>
            }
            header={{
              title: 'Ваше местоположение',
            }}
            className='overflow-y-auto'
            mobileMode
          >
            <UserGeolocation
              onFetchGPS={handleChangeCoords}
              onSelectLocation={handleLocationSelect}
            />
          </CustomDialog>
        </div>
      </CardHeader>
      <hr />
      <CardContent className='p-0'>
        <div className='flex flex-col gap-4 p-3 px-4'>
          {namazTimes.map((namaz, i) => (
            <NamazTimeCardItem key={i} {...namaz} isLoading={!!isLoading} />
          ))}
        </div>
        <div className='bg-primary text-primary-foreground py-2 font-semibold px-4 flex justify-between items-center'>
          <p>{nearestNamazLabel} через</p>
          <p className='font-digits'>{remainingTimeToNearestNamaz}</p>
        </div>
      </CardContent>
    </Card>
  );
}
