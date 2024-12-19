import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { format } from 'date-fns';
import { Battery100Icon as BatteryIcon, WifiIcon, SignalIcon, BellIcon } from '@heroicons/react/24/solid';
import useNotifications from '../hooks/useNotifications';

const Layout: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const { notificationPermission, requestNotificationPermission } = useNotifications();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get battery level if supported
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-indigo-800">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: 'url("/images/masjid-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      {/* Radial Gradient Overlay */}
      <div 
        className="fixed inset-0 bg-gradient-radial from-transparent via-purple-900/50 to-indigo-900/90"
        style={{ zIndex: 0 }}
      />

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-b from-purple-900/80 via-indigo-900/70 to-transparent backdrop-blur-sm text-white">
        {/* Status Bar */}
        <div className="bg-black/30 px-4 py-1 flex justify-between items-center text-xs">
          <span>{format(currentTime, 'h:mm')}</span>
          <div className="flex items-center space-x-2">
            <SignalIcon className="w-4 h-4" />
            <WifiIcon className="w-4 h-4" />
            {batteryLevel !== null && (
              <div className="flex items-center">
                <BatteryIcon className="w-4 h-4" />
                <span className="ml-1">{Math.round(batteryLevel)}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* App Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">IslamGo</h1>
            <div className="flex items-center text-sm opacity-80">
              <span>{format(currentTime, 'EEEE, MMMM d')}</span>
              <span className="mx-2">•</span>
              <span>{format(currentTime, 'h:mm:ss a')}</span>
            </div>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={requestNotificationPermission}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
            >
              <BellIcon className="w-6 h-6" />
              {notificationPermission === 'granted' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-6 pb-24 relative z-10 space-y-6">
        <div className="space-y-8">
        <Outlet />
        </div>
      </main>

      {/* Navigation */}
      <div className="relative z-20">
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;
