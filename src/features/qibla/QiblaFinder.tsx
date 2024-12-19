import { useState, useEffect } from 'react';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compass, setCompass] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const requestLocationAndPermission = async () => {
    try {
      // Request permission for DeviceOrientation events (needed for iOS)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('কম্পাস অ্যাক্সেস করার অনুমতি নেই');
          return;
        }
      }

      // Get location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            setAccuracy(accuracy);
            calculateQiblaDirection(latitude, longitude);
          },
          () => setError('লোকেশন অ্যাক্সেস করা যাচ্ছে না')
        );
      } else {
        setError('এই ডিভাইসে লোকেশন সার্ভিস নেই');
      }
    } catch (err) {
      setError('কম্পাস অ্যাক্সেস করা যাচ্ছে না');
    }
  };

  useEffect(() => {
    requestLocationAndPermission();
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // For iOS devices
      if (event.webkitCompassHeading) {
        setCompass(event.webkitCompassHeading);
      }
      // For Android devices
      else if (event.alpha !== null) {
        setCompass(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setError('এই ডিভাইসে কম্পাস নেই');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    // Coordinates of the Kaaba
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    // Convert all angles to radians
    const φ1 = (latitude * Math.PI) / 180;
    const φ2 = (kaabaLat * Math.PI) / 180;
    const Δλ = ((kaabaLng - longitude) * Math.PI) / 180;

    // Calculate qibla direction using great circle formula
    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let qibla = Math.atan2(y, x);

    // Convert to degrees and normalize
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
  };

  const handleRefresh = () => {
    requestLocationAndPermission();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-[#4E5BA1]">কিবলা দিক নির্ণয়</h2>
        <button 
          onClick={handleRefresh}
          className="p-2 text-[#4E5BA1] hover:bg-gray-100 rounded-full"
        >
          <ArrowPathIcon className="w-6 h-6" />
        </button>
      </div>
      
      {error ? (
        <div className="text-red-500 text-center p-4">
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-[#4E5BA1] text-white rounded-lg hover:bg-[#3D4A90]"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-72 h-72">
            {/* Compass Rose */}
            <div 
              className="absolute inset-0 border-4 border-[#4E5BA1] rounded-full"
              style={{ transform: `rotate(${-compass}deg)` }}
            >
              {/* Compass markings */}
              <div className="absolute inset-0">
                {[...Array(72)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute top-0 left-1/2 h-full origin-bottom ${
                      i % 9 === 0 ? 'w-0.5 bg-[#4E5BA1]' : 'w-px bg-gray-300'
                    }`}
                    style={{ transform: `translateX(-50%) rotate(${i * 5}deg)` }}
                  />
                ))}
              </div>

              {/* Cardinal directions */}
              {['উত্তর', 'পূর্ব', 'দক্ষিণ', 'পশ্চিম'].map((direction, index) => (
                <div
                  key={direction}
                  className="absolute text-sm font-semibold text-[#4E5BA1]"
                  style={{
                    top: index === 0 ? '10%' : index === 2 ? '90%' : '50%',
                    left: index === 3 ? '10%' : index === 1 ? '90%' : '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {direction}
                </div>
              ))}
            </div>

            {/* North indicator (fixed) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-8 bg-red-500"></div>
            </div>

            {/* Qibla direction */}
            {qiblaDirection !== null && (
              <div 
                className="absolute top-1/2 left-1/2 w-full h-1 bg-[#4E5BA1] origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${qiblaDirection}deg)` }}
              >
                <div className="absolute -right-8 -top-4 flex flex-col items-center">
                  <MapPinIcon className="w-8 h-8 text-[#4E5BA1]" />
                  <span className="text-xs font-semibold text-[#4E5BA1]">কাবা</span>
                </div>
              </div>
            )}
          </div>

          {location && (
            <div className="text-center text-sm text-gray-600">
              <p>অবস্থান: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</p>
              {accuracy && <p>নির্ভুলতা: ±{Math.round(accuracy)}m</p>}
              {qiblaDirection && (
                <p className="mt-2 text-[#4E5BA1] font-semibold">
                  কিবলার দিক: {Math.round(qiblaDirection)}°
                </p>
              )}
            </div>
          )}
        </>
      )}

      <div className="text-sm text-gray-500 text-center mt-4">
        <p>সঠিক দিক নির্ণয়ের জন্য ফোনটি সমতল রাখুন</p>
        <p>এবং কম্পাস ক্যালিব্রেট করুন</p>
      </div>
    </div>
  );
};

export default QiblaFinder;
