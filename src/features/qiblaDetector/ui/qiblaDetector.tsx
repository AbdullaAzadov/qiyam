/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

const QiblaDetector = () => {
  const [heading, setHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  // Клавиши-стрелки (заглушка для десктопа)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setHeading((h) => (h + 2) % 360);
      if (e.key === 'ArrowLeft') setHeading((h) => (h - 2 + 360) % 360);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Компас устройства
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha != null) setHeading(e.alpha);
    };

    if ('DeviceOrientationEvent' in window) {
      const D = DeviceOrientationEvent as any;
      if (typeof D.requestPermission === 'function') {
        if (permissionGranted)
          window.addEventListener('deviceorientation', handleOrientation, true);
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
    } catch (err) {
      console.error('Orientation permission error:', err);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Текущее направление от севера</h2>

      {!permissionGranted &&
      (DeviceOrientationEvent as any).requestPermission ? (
        <button
          onClick={requestPermission}
          className='px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'
        >
          Включить компас
        </button>
      ) : (
        <p className='text-4xl font-semibold'>{heading.toFixed(2)}°</p>
      )}
    </div>
  );
};

export default QiblaDetector;
