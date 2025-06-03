/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ICoords } from '@/src/shared/lib/types';
import { useEffect, useState } from 'react';
import { getQiblaDirection } from './lib/utils';

const directions = [
  { label: 'N', angle: 0 },
  { label: 'NE', angle: 45 },
  { label: 'E', angle: 90 },
  { label: 'SE', angle: 135 },
  { label: 'S', angle: 180 },
  { label: 'SW', angle: 225 },
  { label: 'W', angle: 270 },
  { label: 'NW', angle: 315 },
];

const QiblaDetector = () => {
  const [coords, setCoords] = useState<ICoords | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        setDeviceHeading((prev) => prev + 2);
        return;
      }

      if (e.key === 'ArrowLeft') {
        setDeviceHeading((prev) => prev - 2);
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (typeof e.alpha === 'number') setDeviceHeading(e.alpha);
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const D = DeviceOrientationEvent as any;

      if (typeof D.requestPermission === 'function') {
        if (permissionGranted) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      return () =>
        window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [permissionGranted]);

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

  const qiblaAzimuth = coords
    ? getQiblaDirection(coords.latitude, coords.longitude)
    : 0;

  // Вычисляем относительное направление от текущего heading до Каабы
  const relativeDirection = (qiblaAzimuth - deviceHeading + 360) % 360;

  // Радиус круга (для вычисления позиции делений)
  const radius = 80; // половина 160px - подгон под размер круга

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Направление к Кибле</h2>

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
        <div
          className='relative w-44 h-44 rounded-full border-4 border-gray-300 dark:border-gray-600 flex items-center justify-center mt-2'
          style={{
            transform: `rotate(${-deviceHeading}deg)`, // Вращаем весь диск по компасу
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Иконка Каабы */}
          <div
            className='absolute text-3xl select-none'
            style={{
              transform: `rotate(${qiblaAzimuth}deg) translateY(-60px)`, // Позиционируем Каабу по азимуту
            }}
          >
            🕋
          </div>

          {/* Центральная стрелка (указывает направление устройства) */}
          <div className='absolute w-1 h-20 bg-red-600 origin-bottom'></div>

          {/* Деления сторон света */}
          {directions.map(({ label, angle }) => {
            // Вычисляем позицию метки по окружности
            const rad = (angle * Math.PI) / 180;
            const x = radius * Math.sin(rad);
            const y = -radius * Math.cos(rad);
            return (
              <span
                key={label}
                className='absolute text-xs font-semibold select-none'
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  userSelect: 'none',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      <p className='mt-4 text-sm text-gray-600 text-center'>
        {coords ? (
          <>
            Азимут к&nbsp;Каабе:&nbsp;{qiblaAzimuth.toFixed(2)}° <br />
            Ваше направление:&nbsp;{deviceHeading.toFixed(2)}° <br />
            Повернитесь на:&nbsp;{relativeDirection.toFixed(2)}°
          </>
        ) : (
          <>Получаю геолокацию…</>
        )}
      </p>
    </div>
  );
};

export default QiblaDetector;
