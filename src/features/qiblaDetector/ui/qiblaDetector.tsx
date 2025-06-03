/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ICoords } from '@/src/shared/lib/types';
import { useEffect, useRef, useState } from 'react';
import { getQiblaDirection } from './lib/utils';

const QiblaDetector = () => {
  const [coords, setCoords] = useState<ICoords | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  // Получение геолокации
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Ошибка геолокации:', error);
        }
      );
    }
  }, []);

  // Обработчик ориентации устройства
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.alpha === 'number') {
        setCompassHeading(event.alpha);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const devOrientation = DeviceOrientationEvent as any;

      if (typeof devOrientation.requestPermission === 'function') {
        // iOS — ждём разрешения
        if (permissionGranted) {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } else {
        // Android и другие — сразу подключаем
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [permissionGranted]);

  // Запрос разрешения на iOS
  const handleRequestPermission = async () => {
    try {
      const devOrientation = DeviceOrientationEvent as any;
      if (typeof devOrientation.requestPermission === 'function') {
        const result = await devOrientation.requestPermission();
        if (result === 'granted') {
          setPermissionGranted(true);
        }
      }
    } catch (err) {
      console.error('Ошибка разрешения на ориентацию:', err);
    }
  };

  const qiblaAngle = coords
    ? getQiblaDirection(coords.latitude, coords.longitude)
    : 0;
  const rotation = (qiblaAngle - compassHeading + 360) % 360;

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Направление к Кибле</h2>

      {/* Кнопка для iOS */}
      {typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      (DeviceOrientationEvent as any).requestPermission &&
      !permissionGranted ? (
        <button
          onClick={handleRequestPermission}
          className='px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition'
        >
          Включить компас
        </button>
      ) : (
        <div className='relative w-40 h-40 border-4 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mt-2'>
          <div
            ref={arrowRef}
            className='absolute w-1 h-20 bg-red-600 origin-bottom'
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
          />
          <span className='absolute bottom-1 text-xs text-gray-500'>
            Север ↑
          </span>
        </div>
      )}

      <p className='mt-4 text-sm text-gray-600 text-center'>
        {coords ? (
          <>
            Азимут к Каабе: {qiblaAngle.toFixed(2)}° <br />
            Компас: {compassHeading.toFixed(2)}°
          </>
        ) : (
          <>Получение геолокации...</>
        )}
      </p>
    </div>
  );
};

export default QiblaDetector;
