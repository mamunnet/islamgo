import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PrayerTimesType {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface LocationType {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timestamp?: number;
}

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  // Load cached location on mount
  useEffect(() => {
    const cachedLocation = localStorage.getItem('userLocation');
    if (cachedLocation) {
      const parsedLocation: LocationType = JSON.parse(cachedLocation);
      // Check if cached location is less than 24 hours old
      if (parsedLocation.timestamp && Date.now() - parsedLocation.timestamp < 24 * 60 * 60 * 1000) {
        setLocation(parsedLocation);
        return;
      }
    }
    getLocation();
  }, []);

  // Fetch user's location and convert to city/country
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Get city and country from coordinates using reverse geocoding
          const response = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );

          const newLocation: LocationType = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: response.data.city || response.data.locality || 'Unknown City',
            country: response.data.countryName || 'Unknown Country',
            timestamp: Date.now()
          };

          // Cache the location
          localStorage.setItem('userLocation', JSON.stringify(newLocation));
          setLocation(newLocation);
          setLocationError('');
        } catch (error) {
          console.error('Error getting location details:', error);
          setLocationError('Error getting location details');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Error getting your location. Using default location.');
        // Set default location
        const defaultLocation: LocationType = {
          latitude: 22.5726,
          longitude: 88.3639,
          city: 'Kolkata',
          country: 'India',
          timestamp: Date.now()
        };
        localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
        setLocation(defaultLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Fetch prayer times based on location
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!location) return;

      try {
        setLoading(true);
        const response = await axios.get(
          'https://api.aladhan.com/v1/timings',
          {
            params: {
              latitude: location.latitude,
              longitude: location.longitude,
              method: 4,
              tune: '0,3,0,3,0,5,0,0,0',
            },
          }
        );
        setPrayerTimes(response.data.data.timings);
        
        // Set dates
        const gregorianDate = response.data.data.date.gregorian;
        const hijri = response.data.data.date.hijri;
        setCurrentDate(`${gregorianDate.day} ${gregorianDate.month.en} ${gregorianDate.year}`);
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year}H`);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setLoading(false);
      }
    };

    if (location) {
      fetchPrayerTimes();
      const interval = setInterval(fetchPrayerTimes, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [location]);

  // Determine next prayer
  useEffect(() => {
    const determineNextPrayer = () => {
      if (!prayerTimes) return;

      const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ];

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          setNextPrayer(prayer.name);
          break;
        }
      }
    };

    determineNextPrayer();
    const interval = setInterval(determineNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const prayerNames: { [key: string]: string } = {
    Fajr: 'সুবহে সাদিক',
    Dhuhr: 'যোহর',
    Asr: 'আসর',
    Maghrib: 'মাগরিব',
    Isha: 'ইশা',
  };

  if (loading) {
    return (
      <div className="bg-[#4E5BA1] rounded-lg overflow-hidden">
        <div className="p-4 text-white">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-1/3"></div>
            <div className="h-6 bg-white/20 rounded w-2/3"></div>
            <div className="space-y-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-white/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#4E5BA1] rounded-lg overflow-hidden">
      {/* Header with dates and location */}
      <div className="p-4 text-white">
        {/* Top Section with Location */}
        <div className="flex justify-between items-start mb-3">
          {/* Dates Section */}
          <div>
            <div className="text-sm text-[#FFD700] font-medium">{currentDate}</div>
            <div className="text-2xl font-bold text-white mb-1">নামাযের সময়সূচি</div>
            <div className="text-sm text-[#98FB98] font-medium">{hijriDate}</div>
          </div>

          {/* Location Section */}
          <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <svg 
                className="w-5 h-5 text-[#FFD700]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <div>
                <div className="font-bold text-white text-right">
                  {location?.city}
                </div>
                <div className="text-sm text-white/80 text-right">
                  {location?.country}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {locationError && (
          <div className="text-xs text-red-300 mb-3 bg-red-500/10 p-2 rounded">
            {locationError}
          </div>
        )}
        
        {/* Prayer times grid */}
        <div className="space-y-2.5">
          {prayerTimes && Object.entries(prayerNames).map(([key, bengaliName]) => {
            const isNext = key === nextPrayer;
            return (
              <div 
                key={key}
                className={`flex items-center p-3.5 rounded-lg transition-all ${
                  isNext 
                    ? 'bg-white text-[#4E5BA1] shadow-lg' 
                    : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {bengaliName}
                  </div>
                  {isNext && (
                    <div className="text-xs text-[#4E5BA1]/70">
                      পরবর্তী নামায
                    </div>
                  )}
                </div>
                <div className={`text-right ${isNext ? 'font-bold text-lg' : ''}`}>
                  {formatTime(prayerTimes[key])}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
