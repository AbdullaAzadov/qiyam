'use client';
import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { TIMEZONE } from '@/src/shared/lib/consts';

export function useCurrentTime() {
  const [time, setTime] = useState<number>(() =>
    toZonedTime(new Date(), TIMEZONE).getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(toZonedTime(new Date(), TIMEZONE).getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}
