import React, { useState } from 'react';
import PrayerTracking from './PrayerTracking';

interface PrayerStep {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  arabicText?: string;
  banglaText?: string;
}

interface PrayerLesson {
  id: number;
  title: string;
  description: string;
  steps: PrayerStep[];
}

const prayerLessons: PrayerLesson[] = [
  {
    id: 1,
    title: 'নামাজের প্রস্তুতি',
    description: 'নামাজ শুরু করার আগে প্রয়োজনীয় প্রস্তুতি',
    steps: [
      {
        id: 1,
        title: 'অযু করা',
        description: 'সঠিক নিয়মে অযু করা',
        imageUrl: '/images/wudu.png'
      },
      {
        id: 2,
        title: 'পবিত্র স্থান নির্বাচন',
        description: 'পরিষ্কার জায়গা নির্বাচন করা এবং কিবলামুখী হওয়া'
      }
    ]
  },
  {
    id: 2,
    title: 'নামাজের রুকনসমূহ',
    description: 'নামাজের মূল অংশগুলো',
    steps: [
      {
        id: 1,
        title: 'নিয়্যাত',
        description: 'মনে মনে নামাজের নিয়্যাত করা',
        arabicText: 'نويت أن أصلي',
        banglaText: 'নাওয়াইতু আন উসাল্লি'
      },
      {
        id: 2,
        title: 'তাকবীরে তাহরীমা',
        description: 'দুই হাত কান পর্যন্ত উঠিয়ে আল্লাহু আকবার বলা',
        arabicText: 'الله أكبر',
        banglaText: 'আল্লাহু আকবার'
      }
    ]
  }
];

const PrayerGuide: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<PrayerLesson | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Prayer Times and Tracking Section */}
      <div className="mb-8">
        <PrayerTracking />
      </div>

      {/* Prayer Learning Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#4E5BA1] text-white p-4">
          <h2 className="text-xl font-semibold">নামাজ শিক্ষা</h2>
          <p className="text-sm opacity-90">সহজ পদ্ধতিতে নামাজ শিখুন</p>
        </div>

        <div className="p-6">
          {!selectedLesson ? (
            // Lesson Selection View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prayerLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-[#4E5BA1] mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{lesson.description}</p>
                </div>
              ))}
            </div>
          ) : (
            // Lesson Detail View
            <div className="space-y-6">
              {/* Navigation Header */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setCurrentStep(0);
                  }}
                  className="text-[#4E5BA1] hover:underline flex items-center"
                >
                  ← পেছনে যান
                </button>
                <div className="text-sm text-gray-500">
                  ধাপ {currentStep + 1}/{selectedLesson.steps.length}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#4E5BA1] mb-4">
                  {selectedLesson.steps[currentStep].title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {selectedLesson.steps[currentStep].description}
                </p>
                
                {selectedLesson.steps[currentStep].arabicText && (
                  <div className="text-right mb-2">
                    <p className="text-2xl text-[#4E5BA1] font-arabic">
                      {selectedLesson.steps[currentStep].arabicText}
                    </p>
                  </div>
                )}
                
                {selectedLesson.steps[currentStep].banglaText && (
                  <p className="text-lg text-gray-800 mb-4">
                    {selectedLesson.steps[currentStep].banglaText}
                  </p>
                )}

                {selectedLesson.steps[currentStep].imageUrl && (
                  <div className="mt-4">
                    <img
                      src={selectedLesson.steps[currentStep].imageUrl}
                      alt={selectedLesson.steps[currentStep].title}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded ${
                    currentStep === 0
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-[#4E5BA1] text-white hover:bg-[#3D4A90]'
                  }`}
                >
                  পূর্ববর্তী
                </button>
                <button
                  onClick={() =>
                    setCurrentStep(Math.min(selectedLesson.steps.length - 1, currentStep + 1))
                  }
                  disabled={currentStep === selectedLesson.steps.length - 1}
                  className={`px-4 py-2 rounded ${
                    currentStep === selectedLesson.steps.length - 1
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-[#4E5BA1] text-white hover:bg-[#3D4A90]'
                  }`}
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#4E5BA1] text-white p-4">
          <h2 className="text-xl font-semibold">অতিরিক্ত সহায়তা</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-[#4E5BA1] mb-2">নামাজের ভিডিও</h3>
            <p className="text-sm text-gray-600">
              ভিডিও টিউটোরিয়াল দেখে নামাজ শিখুন
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-[#4E5BA1] mb-2">প্রশ্নোত্তর</h3>
            <p className="text-sm text-gray-600">
              নামাজ সম্পর্কিত সাধারণ প্রশ্নের উত্তর
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-[#4E5BA1] mb-2">ডাউনলোড</h3>
            <p className="text-sm text-gray-600">
              নামাজ শিক্ষার PDF ডাউনলোড করুন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerGuide;
