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
      color: 'bg-emerald-600'
    },
    {
      title: 'নামাজ',
      icon: '🕌',
      description: 'নামাজের সময়সূচি এবং নির্দেশনা',
      to: '/prayer-guide',
      color: 'bg-blue-600'
    },
    {
      title: 'তাসবিহ',
      icon: '📿',
      description: 'ডিজিটাল তাসবিহ কাউন্টার',
      to: '/tasbih',
      color: 'bg-purple-600'
    },
    {
      title: 'ইসলামি ক্যালেন্ডার',
      icon: '📅',
      description: 'হিজরি ক্যালেন্ডার এবং ইসলামি দিবস',
      to: '/calendar',
      color: 'bg-orange-600'
    },
    {
      title: 'কিবলা',
      icon: '🧭',
      description: 'কিবলা দিক নির্দেশনা',
      to: '/qibla',
      color: 'bg-rose-600'
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ইসলামি সেবাসমূহ</h2>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default IslamicFeatures;
