'use client';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/src/shared/cn/components/ui/card';
import { NavigationIcon, Volume1Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';

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
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (time === null) return <div className='p-4'>Загрузка...</div>;

  const targets = [
    parseISO(timings.Fajr).getTime(),
    parseISO(timings.Dhuhr).getTime(),
    parseISO(timings.Asr).getTime(),
    parseISO(timings.Maghrib).getTime(),
    parseISO(timings.Isha).getTime(),
  ];

  const namazLabels = ['Фаджр', 'Зухр', 'Аср', 'Магриб', 'Иша'];

  const nearestNamazIndex = targets.findIndex((target) => target > time);
  const nearestNamazTime =
    nearestNamazIndex !== -1
      ? targets[nearestNamazIndex]
      : targets[0] + 24 * 60 * 60 * 1000;
  const nearestNamazLabel =
    nearestNamazIndex !== -1 ? namazLabels[nearestNamazIndex] : namazLabels[0];

  const remainingMs = nearestNamazTime - time;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);
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
            <NamazTime
              label='Фаджр'
              time={timings.Fajr}
              subTime={timings.Sunrise}
              iconCn={iconCn}
              itemCn={itemCn}
            />
            <NamazTime
              label='Зухр'
              time={timings.Dhuhr}
              iconCn={iconCn}
              itemCn={itemCn}
            />
            <NamazTime
              label='Аср'
              time={timings.Asr}
              iconCn={iconCn}
              itemCn={itemCn}
            />
            <NamazTime
              label='Магриб'
              time={timings.Maghrib}
              iconCn={iconCn}
              itemCn={itemCn}
            />
            <NamazTime
              label='Иша'
              time={timings.Isha}
              iconCn={iconCn}
              itemCn={itemCn}
            />
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

type NamazTimeProps = {
  label: string;
  time: string;
  subTime?: string;
  iconCn: string;
  itemCn: string;
};

function NamazTime({ label, time, subTime, iconCn, itemCn }: NamazTimeProps) {
  return (
    <div className={itemCn}>
      <p>
        {label}
        {subTime && (
          <>
            <br />
            <span className='font-light text-sm text-muted-foreground'>
              Восход
            </span>
          </>
        )}
      </p>
      <Volume1Icon className={iconCn} />
      <p className='font-digits'>
        {formatTime(time)}
        {subTime && (
          <>
            <br />
            <span className='font-light text-sm text-muted-foreground'>
              {formatTime(subTime)}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

const formatTime = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'HH:mm');
};
