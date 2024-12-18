import { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compass, setCompass] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          calculateQiblaDirection(position.coords.latitude, position.coords.longitude);
        },
        () => setError('Unable to access location')
      );
    }
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompass(event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setError('Compass not available on this device');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    // Coordinates of the Kaaba
    const kaabaLat = 21.4225;
    const kaabaLong = 39.8262;

    // Convert to radians
    const lat1 = (latitude * Math.PI) / 180;
    const lat2 = (kaabaLat * Math.PI) / 180;
    const longDiff = ((kaabaLong - longitude) * Math.PI) / 180;

    // Calculate qibla direction
    const y = Math.sin(longDiff);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(longDiff);
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-islamic-green-800">Qibla Finder</h2>
      
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="relative w-64 h-64">
            {/* Compass Rose */}
            <div className="absolute inset-0 border-4 border-islamic-green-600 rounded-full">
              {/* North indicator */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                style={{ transform: `rotate(${-compass}deg)` }}
              >
                <div className="w-2 h-8 bg-red-500"></div>
              </div>
              
              {/* Qibla direction */}
              {qiblaDirection !== null && (
                <div 
                  className="absolute top-1/2 left-1/2 w-full h-1 bg-islamic-green-600 origin-center"
                  style={{ transform: `translate(-50%, -50%) rotate(${qiblaDirection - compass}deg)` }}
                >
                  <MapPinIcon className="w-8 h-8 text-islamic-green-600 absolute -right-6 -top-3" />
                </div>
              )}
              
              {/* Cardinal directions */}
              {['N', 'E', 'S', 'W'].map((direction, index) => (
                <div
                  key={direction}
                  className="absolute text-sm font-semibold text-gray-600"
                  style={{
                    top: direction === 'N' ? '10%' : direction === 'S' ? '90%' : '50%',
                    left: direction === 'W' ? '10%' : direction === 'E' ? '90%' : '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {direction}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-islamic-green-800">
            {qiblaDirection !== null ? (
              <>
                <p>Qibla Direction: {Math.round(qiblaDirection)}°</p>
                <p className="text-sm text-gray-600 mt-2">
                  Align the green arrow with the red compass needle
                </p>
              </>
            ) : (
              <p>Calculating Qibla direction...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaFinder;
