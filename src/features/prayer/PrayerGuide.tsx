import React, { useState } from 'react';
import PrayerTracking from './PrayerTracking';

interface PrayerContent {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  arabicText?: string;
  banglaText?: string;
  audioUrl?: string;
}

interface PrayerCategory {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: PrayerContent[];
}

const prayerCategories: PrayerCategory[] = [
  {
    id: 1,
    title: 'অযু শিক্ষা',
    description: 'সঠিক নিয়মে অযু করার পদ্ধতি',
    icon: '💧',
    color: 'from-cyan-500 to-blue-500',
    content: [
      {
        id: 1,
        title: 'নিয়্যাত করা',
        description: 'অযু শুরু করার আগে মনে মনে নিয়্যাত করা',
        arabicText: 'نويت الوضوء لرفع الحدث الأصغر فرضا لله تعالى',
        banglaText: 'নাওয়াইতুল ওযুয়া লিরাফইল হাদাছিল আসগারি ফারদাল্লিল্লাহি তাআলা',
        imageUrl: '/images/wudu/niyyah.jpg'
      },
      {
        id: 2,
        title: 'হাত ধোয়া',
        description: 'প্রথমে ডান হাত, তারপর বাম হাত কব্জি পর্যন্ত তিনবার ধোয়া',
        imageUrl: '/images/wudu/hands.jpg'
      },
    ]
  },
  {
    id: 2,
    title: 'নামাজের নিয়ম',
    description: 'নামাজ আদায়ের সঠিক পদ্ধতি',
    icon: '🕌',
    color: 'from-emerald-500 to-green-500',
    content: [
      {
        id: 1,
        title: 'নিয়্যাত',
        description: 'নামাজ শুরু করার আগে মনে মনে নিয়্যাত করা',
        arabicText: 'نويت أن أصلي',
        banglaText: 'নাওয়াইতু আন উসাল্লি',
        imageUrl: '/images/prayer/niyyah.jpg'
      },
    ]
  },
  {
    id: 3,
    title: 'সূরা ও দোয়া',
    description: 'নামাজে পড়ার সূরা ও দোয়াসমূহ',
    icon: '📖',
    color: 'from-amber-500 to-orange-500',
    content: [
      {
        id: 1,
        title: 'সূরা ফাতিহা',
        description: 'প্রতি রাকাতে সূরা ফাতিহা পড়া ফরজ',
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        banglaText: 'বিসমিল্লাহির রাহমানির রাহীম',
        audioUrl: '/audio/fatiha.mp3'
      },
    ]
  }
];

const PrayerGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showArabic, setShowArabic] = useState(true);
  const [showBengali, setShowBengali] = useState(true);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Prayer Times and Tracking Section */}
      <div>
        <PrayerTracking />
      </div>

      {/* Main Content Section */}
      <div className="relative rounded-lg shadow-md overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop")',
            filter: 'brightness(0.2)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 bg-black/30 backdrop-blur-sm">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">নামাজ শিক্ষা</h2>
            <p className="text-sm text-white/80">সহজ পদ্ধতিতে নামাজ শিখুন</p>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end gap-2 p-4">
            <button
              onClick={() => setShowArabic(!showArabic)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                showArabic ? 'bg-[#F87B14] text-white' : 'bg-black/30 text-white'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setShowBengali(!showBengali)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                showBengali ? 'bg-[#F87B14] text-white' : 'bg-black/30 text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          <div className="p-4">
            {!selectedCategory ? (
              // Category Selection View
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {prayerCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`bg-gradient-to-br ${category.color} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {category.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Category Detail View
              <div className="space-y-6">
                {/* Navigation Header */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentStep(0);
                    }}
                    className="text-[#F87B14] hover:text-[#F87B14]/80 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    পেছনে যান
                  </button>
                  <div className="text-sm text-white/60">
                    ধাপ {currentStep + 1}/{selectedCategory.content.length}
                  </div>
                </div>

                {/* Step Content */}
                <div className="bg-white/5 rounded-xl p-6 space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedCategory.content[currentStep].title}
                  </h3>
                  <p className="text-lg text-white/90 leading-relaxed">
                    {selectedCategory.content[currentStep].description}
                  </p>
                  
                  {showArabic && selectedCategory.content[currentStep].arabicText && (
                    <div className="text-right py-6 px-4 bg-white/5 rounded-lg">
                      <p className="text-3xl text-white font-arabic leading-loose">
                        {selectedCategory.content[currentStep].arabicText}
                      </p>
                    </div>
                  )}
                  
                  {showBengali && selectedCategory.content[currentStep].banglaText && (
                    <div className="py-4 px-4 bg-white/5 rounded-lg">
                      <p className="text-xl text-white/90">
                        {selectedCategory.content[currentStep].banglaText}
                      </p>
                    </div>
                  )}

                  {selectedCategory.content[currentStep].imageUrl && (
                    <div className="mt-6 rounded-lg overflow-hidden">
                      <img
                        src={selectedCategory.content[currentStep].imageUrl}
                        alt={selectedCategory.content[currentStep].title}
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}

                  {selectedCategory.content[currentStep].audioUrl && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <audio
                        controls
                        className="w-full"
                        src={selectedCategory.content[currentStep].audioUrl}
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className={`px-4 py-2 rounded ${
                      currentStep === 0
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    পূর্ববর্তী
                  </button>
                  
                  {/* Progress Indicator */}
                  <div className="flex gap-1">
                    {selectedCategory.content.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep
                            ? 'bg-[#F87B14]'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentStep(Math.min(selectedCategory.content.length - 1, currentStep + 1))
                    }
                    disabled={currentStep === selectedCategory.content.length - 1}
                    className={`px-4 py-2 rounded ${
                      currentStep === selectedCategory.content.length - 1
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    পরবর্তী
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerGuide;