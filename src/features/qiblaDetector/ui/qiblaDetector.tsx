/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

// Координаты Каабы
const KAABA_LAT = 21.4225; // широта
const KAABA_LON = 39.8262; // долгота

/** Возвращает азимут (0–360°), по которому нужно повернуться от севера,
 *  чтобы смотреть на Каабу.  */
function getQiblaAzimuth(lat1: number, lon1: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LON - lon1);

  const x = Math.sin(Δλ) * Math.cos(φ2);
  const y =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(x, y); // радианы
  return (toDeg(θ) + 360) % 360; // градусы 0–360
}

const QiblaDetector = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [heading, setHeading] = useState<number>(0);
  const [alpha, setAlpha] = useState<number>(0);
  const [beta, setBeta] = useState<number>(0);
  const [gamma, setGamma] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  /* ---------- Геолокация ---------- */
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setHeading((h) => (h + 2) % 360);
      if (e.key === 'ArrowLeft') setHeading((h) => (h - 2 + 360) % 360);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* ---------- Компас устройства ---------- */
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha != null) setHeading(e.alpha);
      if (e.alpha != null) setAlpha(e.alpha);
      if (e.beta != null) setBeta(e.beta);
      if (e.gamma != null) setGamma(e.gamma);
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

  /* ---------- Расчёт азимута к Кибле ---------- */
  const qiblaAzimuth =
    coords != null ? getQiblaAzimuth(coords.lat, coords.lon) : null;

  /* ---------- JSX ---------- */
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] px-4'>
      <h2 className='text-xl font-bold mb-4'>Азимут к&nbsp;Кибле</h2>

      {!permissionGranted &&
      (DeviceOrientationEvent as any).requestPermission ? (
        <button
          onClick={requestPermission}
          className='px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition'
        >
          Включить компас
        </button>
      ) : (
        <>
          {/* Координаты пользователя */}
          {coords ? (
            <p className='mb-2 text-center'>
              Ваша широта&nbsp;/&nbsp;долгота:
              <br />
              <span className='font-mono'>
                {coords.lat.toFixed(5)}°, {coords.lon.toFixed(5)}°
              </span>
            </p>
          ) : (
            <p className='mb-2'>Получаю координаты…</p>
          )}

          {/* Азимут к Кибле */}
          {qiblaAzimuth != null && (
            <p className='mb-2'>
              Кааба находится под углом&nbsp;
              <span className='font-semibold'>
                {qiblaAzimuth.toFixed(2)}°
              </span>{' '}
              от севера
            </p>
          )}

          {/* Текущее направление устройства */}
          <p>
            Ваш курс сейчас:&nbsp;
            <span className='font-semibold'>{heading.toFixed(2)}°</span>
          </p>
          <div>
            <p>α: {alpha.toFixed(2)}°</p>
            <p>β: {beta.toFixed(2)}°</p>
            <p>γ: {gamma.toFixed(2)}°</p>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaDetector;
