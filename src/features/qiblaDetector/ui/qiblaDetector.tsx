'use client';
import { ICoords } from '@/src/shared/lib/types';
import { useEffect, useRef, useState } from 'react';
import { getQiblaDirection } from './lib/utils';

const QiblaDetector = () => {
  const [coords, setCoords] = useState<ICoords | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.alpha === 'number') {
        setCompassHeading(event.alpha);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      if ((DeviceOrientationEvent as any).requestPermission) {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              window.addEventListener(
                'deviceorientation',
                handleOrientation,
                true
              );
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  const qiblaAngle = coords
    ? getQiblaDirection(coords.latitude, coords.longitude)
    : 0;
  const rotation = (qiblaAngle - compassHeading + 360) % 360;

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh]'>
      <h2 className='text-xl font-bold mb-4'>Направление к Кибле</h2>
      <div className='relative w-40 h-40 border-4 border-gray-300 rounded-full flex items-center justify-center'>
        <div
          ref={arrowRef}
          className='absolute w-1 h-20 bg-red-600 origin-bottom'
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease-out',
          }}
        />
        <span className='absolute bottom-1 text-xs text-gray-500'>Север ↑</span>
      </div>
      <p className='mt-4 text-sm text-gray-600'>
        Азимут к Каабе: {qiblaAngle.toFixed(2)}° <br />
        Компас: {compassHeading.toFixed(2)}°
      </p>
    </div>
  );
};

export default QiblaDetector;
