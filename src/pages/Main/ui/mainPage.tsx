'use client';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/src/shared/cn/components/ui/card';
import { NavigationIcon, Volume1Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  timings: {
    Dhuhr: string;
    Asr: string;
    Fajr: string;
    Firstthird: string;
    Imsak: string;
    Isha: string;
    Lastthird: string;
    Maghrib: string;
    Midnight: string;
    Sunrise: string;
    Sunset: string;
  };
};

export default function MainPage({ timings }: Props) {
  const iconCn =
    'absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 size-4.5 stroke-1 text-muted-foreground';
  const itemCn = 'flex items-center justify-between relative font-semibold';
  const [time, setTime] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const targets = [
    new Date(timings.Fajr).getTime(),
    new Date(timings.Dhuhr).getTime(),
    new Date(timings.Asr).getTime(),
    new Date(timings.Maghrib).getTime(),
    new Date(timings.Isha).getTime(),
  ];

  const namazLabels = ['Фаджр', 'Зухр', 'Аср', 'Магриб', 'Иша'];

  const nearestNamazIndex = targets.findIndex((target) => target > time);
  const nearestNamaz = targets[nearestNamazIndex];
  const nearestNamazLabel = namazLabels[nearestNamazIndex];
  console.log(nearestNamaz, nearestNamazLabel);

  const remainingTime = nearestNamaz ? nearestNamaz - time : 0;
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  const remainingTimeStr = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className='p-4'>
      <Card className='p-0 overflow-hidden gap-0'>
        <CardHeader className='p-0'>
          <div className='flex justify-between items-center px-4 pt-2'>
            <p className='text-foreground text-lg'>Время намаза</p>
            <p className='text-muted-foreground text-sm cursor-pointer'>
              Алматы{' '}
              <NavigationIcon className='size-3 inline fill-muted text-muted' />
            </p>
          </div>
        </CardHeader>
        <hr />
        <CardContent className='p-0'>
          <div className='flex flex-col gap-4 p-3 px-4'>
            <div className={itemCn}>
              <p>
                Фаджр
                <br />
                <span className='font-light text-sm text-muted-foreground'>
                  Восход
                </span>
              </p>
              <Volume1Icon className={iconCn} />
              <p className='font-digits'>
                {formatTime(timings.Fajr)}
                <br />
                <span className='font-light text-sm text-muted-foreground'>
                  {formatTime(timings.Sunrise)}
                </span>
              </p>
            </div>
            <div className={itemCn}>
              <p>Зухр</p>
              <Volume1Icon className={iconCn} />

              <p className='font-digits'>{formatTime(timings.Dhuhr)}</p>
            </div>
            <div className={itemCn}>
              <p>Аср</p>
              <Volume1Icon className={iconCn} />
              <p className='font-digits'>{formatTime(timings.Asr)}</p>
            </div>
            <div className={itemCn}>
              <p>Магриб</p>
              <Volume1Icon className={iconCn} />
              <p className='font-digits'>{formatTime(timings.Maghrib)}</p>
            </div>
            <div className={itemCn}>
              <p>Иша</p>
              <Volume1Icon className={iconCn} />
              <p className='font-digits'>{formatTime(timings.Isha)}</p>
            </div>
          </div>
          <div className='bg-primary text-primary-foreground py-2 font-semibold px-4 flex justify-between items-center'>
            <p>{nearestNamazLabel} через</p>
            <p className='font-digits'>{remainingTimeStr}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
