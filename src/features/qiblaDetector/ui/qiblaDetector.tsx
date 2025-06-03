/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ICoords } from '@/src/shared/lib/types';
import { useEffect, useState } from 'react';
import { getQiblaDirection } from './lib/utils';

const QiblaDetector = () => {
  const [coords, setCoords] = useState<ICoords | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  /* ---------- Геолокация ---------- */
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  /* ---------- Датчик ориентации ---------- */
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (typeof e.alpha === 'number') setCompassHeading(e.alpha);
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const D = DeviceOrientationEvent as any;

      // iOS 13+: нужно отдельное разрешение
      if (typeof D.requestPermission === 'function') {
        if (permissionGranted) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } else {
        // Android / десктоп
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      return () =>
        window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [permissionGranted]);

  /* ---------- Разрешение для iOS ---------- */
  const requestPermission = async () => {
    try {
      const D = DeviceOrientationEvent as any;
      if (typeof D.requestPermission === 'function') {
        const res = await D.requestPermission();
        if (res === 'granted') setPermissionGranted(true);
      }
    } catch (e) {
      console.error('Orientation permission error:', e);
    }
  };

  /* ---------- Геометрия ---------- */
  const qiblaAzimuth = coords
    ? getQiblaDirection(coords.latitude, coords.longitude)
    : 0;
  // угол, на который надо повернуть компас-диск
  const diskRotation = (qiblaAzimuth - compassHeading + 360) % 360;

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Направление к Кибле</h2>

      {/* Кнопка для iOS */}
      {typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      (DeviceOrientationEvent as any).requestPermission &&
      !permissionGranted ? (
        <button
          onClick={requestPermission}
          className='px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'
        >
          Включить компас
        </button>
      ) : (
        /* --- Компас --- */
        <div
          className='relative w-44 h-44 rounded-full border-4 border-gray-300 dark:border-gray-600 flex items-center justify-center mt-2'
          style={{
            transform: `rotate(${diskRotation}deg)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Иконка Каабы на ободе (изначально «север») */}
          <div className='absolute -top-4 left-1/2 -translate-x-1/2 text-3xl select-none'>
            🕋
          </div>

          {/* Центральная стрелка (фиксирована) */}
          <div className='absolute w-1 h-20 bg-red-600 origin-bottom'></div>

          {/* Метки сторон света, если нужны */}
          {/* <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs">N</span> */}
        </div>
      )}

      {/* Текстовая справка */}
      <p className='mt-4 text-sm text-gray-600 text-center'>
        {coords ? (
          <>
            Азимут к&nbsp;Каабе:&nbsp;{qiblaAzimuth.toFixed(2)}° <br />
            Компас:&nbsp;{compassHeading.toFixed(2)}°
          </>
        ) : (
          <>Получаю геолокацию…</>
        )}
      </p>
    </div>
  );
};

export default QiblaDetector;
