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
  const [showNotification, setShowNotification] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);

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

      // Find current prayer
      let foundCurrent = false;
      for (let i = prayers.length - 1; i >= 0; i--) {
        const [hours, minutes] = prayers[i].time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;
        
        if (prayerTime <= currentTime) {
          setCurrentPrayer(prayers[i].name);
          foundCurrent = true;
          break;
        }
      }
      
      if (!foundCurrent) {
        setCurrentPrayer(prayers[prayers.length - 1].name);
      }

      let foundNext = false;
      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          foundNext = true;
          setNextPrayer(prayer.name);
          
          // Calculate time left
          const minutesLeft = prayerTime - currentTime;
          const hoursLeft = Math.floor(minutesLeft / 60);
          const remainingMinutes = minutesLeft % 60;
          
          if (hoursLeft > 0) {
            setTimeLeft(`${hoursLeft} ঘণ্টা ${remainingMinutes} মিনিট`);
          } else {
            setTimeLeft(`${remainingMinutes} মিনিট`);
          }
          break;
        }
      }
      
      // If no next prayer found, set to first prayer of next day
      if (!foundNext && prayers.length > 0) {
        setNextPrayer(prayers[0].name);
        const [hours, minutes] = prayers[0].time.split(':').map(Number);
        const nextDayMinutes = (24 * 60) - currentTime + (hours * 60 + minutes);
        const hoursLeft = Math.floor(nextDayMinutes / 60);
        const remainingMinutes = nextDayMinutes % 60;
        setTimeLeft(`${hoursLeft} ঘণ্টা ${remainingMinutes} মিনিট`);
      }
    };

    determineNextPrayer();
    const interval = setInterval(determineNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Helper function to add minutes to time
  const formatTime = (time: string, addMinutes: number = 0) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + addMinutes);
    
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const handlePrayerClick = (prayerName: string) => {
    setSelectedPrayer(selectedPrayer === prayerName ? null : prayerName);
  };

  const prayerNames: { [key: string]: string } = {
    Fajr: 'সুবহে সাদিক',
    Dhuhr: 'যোহর',
    Asr: 'আসর',
    Maghrib: 'মাগরিব',
    Isha: 'ইশা',
  };
  
  const handleNotificationToggle = () => {
    setShowNotification(!showNotification);
    // Here you would implement the actual notification logic
    if (!showNotification) {
      toast.success('নামাযের নোটিফিকেশন চালু করা হয়েছে');
    } else {
      toast.info('নামাযের নোটিফিকেশন বন্ধ করা হয়েছে');
    }
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
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop")',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 backdrop-blur-sm bg-black/30">
        {/* Top Section */}
        <div className="p-4">
          {/* Hijri Date */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-yellow-300 font-medium text-lg">
              {hijriDate}
            </div>
            
            {/* Location */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
              <svg 
                className="w-4 h-4 text-yellow-300" 
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
              </svg>
              <span className="text-white font-medium">{location?.city}</span>
            </div>
          </div>
          
          {/* Notification Toggle */}
          <button
            onClick={handleNotificationToggle}
            className={`mt-2 mb-6 p-2 rounded-full transition-colors ${
              showNotification ? 'bg-[#F87B14] text-white' : 'bg-white/10 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Current Prayer Info */}
          {nextPrayer && prayerTimes && (
            <div className="bg-white/10 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white/80 mb-1">পরবর্তী নামাজ</h3>
                  <div className="text-3xl font-bold text-white">{prayerNames[nextPrayer]}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-300 text-sm mb-1">বাকি আছে</div>
                  <div className="text-2xl font-bold text-white">{timeLeft}</div>
                </div>
              </div>
              
              {/* Current Prayer Status */}
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <div className="text-white/80 text-sm mb-1">বর্তমান ওয়াক্ত</div>
                <div className="text-xl font-bold text-emerald-300">
                  {prayerNames[currentPrayer]}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-white/80 text-sm mb-1">আযান</div>
                  <div className="text-xl font-bold text-yellow-300">
                    {formatTime(prayerTimes[nextPrayer])}
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-white/80 text-sm mb-1">ইকামাত</div>
                  <div className="text-xl font-bold text-emerald-300">
                    {formatTime(prayerTimes[nextPrayer], 10)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between px-4 py-3 bg-white/5 mt-6">
          {prayerTimes && Object.entries(prayerNames).map(([key, bengaliName]) => {
            const isNext = key === nextPrayer;
            const isSelected = key === selectedPrayer;

            return (
              <button
                onClick={() => handlePrayerClick(key)}
                key={key}
                className={`text-center transition-all ${
                  isSelected
                    ? 'bg-white/20 rounded-lg'
                    : isNext
                      ? 'text-yellow-300'
                      : 'text-white/90'
                } px-3 py-2 hover:bg-white/10 rounded-lg
                }`}
              >
                <div className="text-xs font-medium mb-1">{bengaliName}</div>
                <div className={`text-sm ${isNext ? 'font-bold' : ''}`}>
                  {formatTime(prayerTimes[key])}
                </div>
                {isSelected && (
                  <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
                    <div className="text-xs text-yellow-300">
                      আযান: {formatTime(prayerTimes[key])}
                    </div>
                    <div className="text-xs text-emerald-300">
                      ইকামাত: {formatTime(prayerTimes[key], 10)}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {locationError && (
          <div className="text-xs text-red-300 p-2 bg-red-500/10 mx-4 mb-2 rounded">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimes;