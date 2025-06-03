'use client'; // Mark this as a Client Component since it uses browser APIs

import { useEffect, useState } from 'react';
import {
  DetectDeviceOrientation,
  Orientation,
} from 'detect-device-orientation';

export default function QiblaDetector() {
  const [orientation, setOrientation] = useState<Orientation>({
    absolute: false,
    alpha: 0,
    beta: 0,
    gamma: 0,
    webkitCompassHeading: undefined,
    webkitCompassAccuracy: undefined,
  });
  const [permissionState, setPermissionState] = useState('prompt'); // 'granted', 'denied', or 'prompt'
  const [error, setError] = useState(null);

  // Initialize the device orientation detector
  const detectDeviceOrientation = new DetectDeviceOrientation();

  // Handle orientation updates
  const handleOrientationChange = (orientationData: Orientation) => {
    setOrientation({
      absolute: orientationData.absolute,
      alpha: orientationData.alpha,
      beta: orientationData.beta,
      gamma: orientationData.gamma,
      webkitCompassHeading: orientationData.webkitCompassHeading,
      webkitCompassAccuracy: orientationData.webkitCompassAccuracy,
    });
  };

  // Request permission for iOS Safari
  const requestPermission = () => {
    detectDeviceOrientation.requestDeviceOrientationPermission();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      // For iOS Safari, check if permission is needed
      // No permission needed, initialize directly
      detectDeviceOrientation.init(handleOrientationChange);
      setPermissionState('granted');
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Device Orientation</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {permissionState === 'prompt' && (
        <button onClick={requestPermission}>
          Request Device Orientation Permission
        </button>
      )}
      {permissionState === 'granted' && (
        <div>
          <p>Absolute: {orientation.absolute ? 'True' : 'False'}</p>
          <p>Alpha (Z-axis rotation): {orientation.alpha}°</p>
          <p>Beta (X-axis rotation): {orientation.beta}°</p>
          <p>Gamma (Y-axis rotation): {orientation.gamma}°</p>
          {orientation.webkitCompassHeading !== null && (
            <p>Compass Heading: {orientation.webkitCompassHeading}°</p>
          )}
          {orientation.webkitCompassAccuracy !== null && (
            <p>Compass Accuracy: {orientation.webkitCompassAccuracy}</p>
          )}
        </div>
      )}
      {permissionState === 'denied' && (
        <p>Permission for device orientation was denied.</p>
      )}
    </div>
  );
}
