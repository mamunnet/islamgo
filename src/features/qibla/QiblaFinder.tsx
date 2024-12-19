import { useState, useEffect } from 'react';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Extend DeviceOrientationEvent for Safari
interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compass, setCompass] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [bezelRotation, setBezelRotation] = useState(0);

  const requestLocationAndPermission = async () => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('কম্পাস অ্যাক্সেস করার অনুমতি নেই');
          return;
        }
      }

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
    const handleOrientation = (event: ExtendedDeviceOrientationEvent) => {
      if (event.webkitCompassHeading) {
        setCompass(event.webkitCompassHeading);
      } else if (event.alpha !== null) {
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
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const φ1 = (latitude * Math.PI) / 180;
    const φ2 = (kaabaLat * Math.PI) / 180;
    const Δλ = ((kaabaLng - longitude) * Math.PI) / 180;
    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;
    setQiblaDirection(qibla);
  };

  const handleRefresh = () => {
    requestLocationAndPermission();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A237E] via-[#3949AB] to-[#3F51B5] p-4">
      {/* Top App Bar */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">কিবলা দিক নির্ণয়</h2>
          <button 
            onClick={handleRefresh}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {error ? (
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
            <p className="text-white mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all transform hover:scale-105"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            {/* Compass Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
              <div className="relative w-80 h-80">
                {/* Outer Case */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.3)] p-2">
                  {/* Glass Effect Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent"></div>
                  
                  {/* Rotating Bezel */}
                  <div 
                    className="absolute inset-1 rounded-full border-8 border-gray-800 bg-gray-900 cursor-pointer transform transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(${bezelRotation}deg)` }}
                    onClick={() => setBezelRotation(bezelRotation + 5)}
                  >
                    {/* Bezel Markings */}
                    {[...Array(72)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${i * 5}deg)` }}
                      >
                        <div 
                          className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
                            i % 2 === 0 ? 'h-3 w-1' : 'h-2 w-0.5'
                          } ${i % 6 === 0 ? 'bg-white' : 'bg-gray-400'}`}
                        />
                        {i % 6 === 0 && (
                          <div 
                            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono"
                            style={{ transform: `rotate(${-i * 5}deg)` }}
                          >
                            {i * 5}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Inner Compass Face */}
                  <div 
                    className="absolute inset-8 rounded-full bg-[#0A0A0A] shadow-inner"
                    style={{ transform: `rotate(${-compass}deg)` }}
                  >
                    {/* Compass Rose */}
                    <div className="absolute inset-0">
                      {/* Main Directions */}
                      {['উ', 'পূ', 'দ', 'প'].map((dir, i) => (
                        <div
                          key={dir}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ transform: `rotate(${i * 90}deg)` }}
                        >
                          <div className="relative h-full">
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-semibold text-lg">
                              {dir}
                            </div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-white shadow-glow" />
                          </div>
                        </div>
                      ))}

                      {/* Degree Markings */}
                      {[...Array(360)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute inset-0"
                          style={{ transform: `rotate(${i}deg)` }}
                        >
                          <div 
                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
                              i % 5 === 0 ? 'h-2 w-0.5 bg-white' : 'h-1 w-px bg-gray-700'
                            }`}
                          />
                        </div>
                      ))}

                      {/* Compass Needle */}
                      <div className="absolute inset-0">
                        {/* North */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-[45%] bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-t-full shadow-glow" />
                        {/* South */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-[45%] bg-gradient-to-t from-gray-200 via-white to-gray-200 rounded-b-full" />
                        {/* Center Pin */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg border-2 border-gray-500" />
                          <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-gray-400 to-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Qibla Indicator */}
                  {qiblaDirection !== null && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ transform: `rotate(${qiblaDirection}deg)` }}
                    >
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        <div className="flex flex-col items-center">
                          <MapPinIcon className="w-6 h-6 text-green-400 animate-pulse" />
                          <span className="text-xs font-semibold text-green-400">কাবা</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Info Card */}
            {location && (
              <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    <span className="text-sm text-white">
                      {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                    </span>
                  </div>
                  {accuracy && (
                    <div className="bg-white/20 px-4 py-2 rounded-full">
                      <span className="text-sm text-white">
                        ±{Math.round(accuracy)}m
                      </span>
                    </div>
                  )}
                </div>
                {qiblaDirection && (
                  <div className="bg-white/20 px-4 py-2 rounded-full text-center">
                    <span className="text-white font-semibold">
                      কিবলার দিক: {Math.round(qiblaDirection)}°
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Instructions Card */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-4">
              <div className="space-y-2 text-white/90">
                <p className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>ফোনটি সমতল রাখুন</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>কম্পাস ক্যালিব্রেট করতে ৮ আকৃতিতে ঘুরান</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span>বেজেল ঘুরাতে ক্লিক করুন</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QiblaFinder;
