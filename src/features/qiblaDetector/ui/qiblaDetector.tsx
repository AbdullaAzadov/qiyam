/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ICoords } from '@/src/shared/lib/types';
import { useEffect, useState } from 'react';
import { getQiblaDirection } from './lib/utils';

const QiblaDetector = () => {
  const [coords, setCoords] = useState<ICoords | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        setDeviceHeading((prev) => (prev + 2) % 360);
        return;
      }

      if (e.key === 'ArrowLeft') {
        setDeviceHeading((prev) => (prev - 2 + 360) % 360);
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
      if (e.alpha !== null) setDeviceHeading(e.alpha);
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
  const circleRotation = -deviceHeading; // Вращаем фон в противоположную сторону

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Направление к Кибле</h2>

      {!permissionGranted &&
      (DeviceOrientationEvent as any).requestPermission ? (
        <button
          onClick={requestPermission}
          className='px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'
        >
          Включить компас
        </button>
      ) : (
        <div className='relative w-64 h-64'>
          {/* Вращающийся фон с Каабой и направлениями */}
          <div
            className='absolute w-full h-full rounded-full border-4 border-gray-300'
            style={{
              transform: `rotate(${circleRotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            {/* Иконка Каабы (вращается вместе с фоном) */}
            <div
              className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl'
              style={{
                transform: `rotate(${qiblaAzimuth}deg)`,
                transformOrigin: '50% calc(100% + 32px)',
              }}
            >
              🕋
            </div>

            {/* Серые направления (крестом) */}
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <div
                key={dir}
                className='absolute text-gray-500 font-bold'
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%)
                    rotate(${i * 90}deg)
                    translateY(-80px)
                    rotate(${-circleRotation}deg)
                  `,
                }}
              >
                {dir}
              </div>
            ))}
          </div>

          {/* Фиксированная белая стрелка (всегда вверху) */}
          <div className='absolute top-1/2 left-1/2 w-1 h-24 bg-white origin-bottom -translate-x-1/2 -translate-y-1/2' />
        </div>
      )}

      <div className='mt-4 text-center'>
        {coords ? (
          <>
            <p>Азимут к Каабе: {qiblaAzimuth.toFixed(2)}°</p>
            <p>Текущее направление: {deviceHeading.toFixed(2)}°</p>
            <p>Угол до Каабы: {(qiblaAzimuth - deviceHeading + 360) % 360}°</p>
          </>
        ) : (
          <p>Получаю геолокацию...</p>
        )}
      </div>
    </div>
  );
};

export default QiblaDetector;
