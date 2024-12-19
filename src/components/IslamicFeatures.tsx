import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  to: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, description, to, color }) => (
  <Link 
    to={to}
    className={`${color} rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
  >
    <div className="text-white">
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  </Link>
);

const IslamicFeatures = () => {
  const features = [
    {
      title: 'হাদিস',
      icon: '📚',
      description: 'বিশুদ্ধ হাদিস সংগ্রহ',
      to: '/hadith',
      color: 'bg-white/10 hover:bg-white/20'
    },
    {
      title: 'নামাজ',
      icon: '🕌',
      description: 'নামাজের সময়সূচি এবং শিক্ষা',
      to: '/prayer',
      color: 'bg-white/10 hover:bg-white/20'
    },
    {
      title: 'তাসবিহ',
      icon: '📿',
      description: 'ডিজিটাল তাসবিহ কাউন্টার',
      to: '/tasbih',
      color: 'bg-white/10 hover:bg-white/20'
    },
    {
      title: 'ইসলামি ক্যালেন্ডার',
      icon: '📅',
      description: 'হিজরি ক্যালেন্ডার এবং ইসলামি দিবস',
      to: '/calendar',
      color: 'bg-white/10 hover:bg-white/20'
    },
    {
      title: 'কিবলা',
      icon: '🧭',
      description: 'কিবলা দিক নির্দেশনা',
      to: '/qibla',
      color: 'bg-white/10 hover:bg-white/20'
    }
  ];

  return (
    <div className="relative rounded-lg shadow-md overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1000&auto=format&fit=crop")',
          filter: 'brightness(0.3)'
        }}
      />

      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm text-white p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">ইসলামি সেবাসমূহ</h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 bg-black/30 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IslamicFeatures;
