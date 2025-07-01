import { KAABA_COORDS } from '@/src/shared/lib/consts';

export function getQiblaDirection(userLat: number, userLon: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRadians(userLat);
  const lon1 = toRadians(userLon);
  const lat2 = toRadians(KAABA_COORDS.latitude);
  const lon2 = toRadians(KAABA_COORDS.longitude);

  const deltaLon = lon2 - lon1;
  const x = Math.sin(deltaLon) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const bearing = Math.atan2(x, y);
  return (toDegrees(bearing) + 360) % 360;
}
