import { getZonedTime } from '@/src/shared/lib/utils';
import { INamazTimings } from '../api/types';
import { NAMAZ_TIMES_NAMES } from '@/src/shared/lib/consts';

export function getNearestNamazTime(namazTimes?: INamazTimings, time?: number) {
  if (!namazTimes || !time)
    return { remainingTimeToNearestNamaz: '', label: '' };
  const timings = [
    getZonedTime(namazTimes.Fajr),
    getZonedTime(namazTimes.Dhuhr),
    getZonedTime(namazTimes.Asr),
    getZonedTime(namazTimes.Maghrib),
    getZonedTime(namazTimes.Isha),
  ];

  const nearestNamazIndex = timings.findIndex((target) => target > time);

  const nearestNamazTime =
    nearestNamazIndex !== -1
      ? timings[nearestNamazIndex]
      : timings[0] + 24 * 60 * 60 * 1000;
  const nearestNamazLabel =
    NAMAZ_TIMES_NAMES[nearestNamazIndex !== -1 ? nearestNamazIndex : 0];

  const remainingMs = nearestNamazTime - time;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);
  const remainingTimeToNearestNamaz = `${hours
    .toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return { nearestNamazLabel, remainingTimeToNearestNamaz };
}
