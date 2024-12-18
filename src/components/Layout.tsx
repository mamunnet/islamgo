import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-color-primary text-white p-4">
        <h1 className="text-2xl font-bold">IslamGo</h1>
        <p className="text-sm opacity-80">Your Islamic Companion</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl p-4 pb-24">
        <Outlet />
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Layout;
