import React, { useState, useEffect } from 'react';

interface Dhikr {
  id: number;
  arabic: string;
  bengali: string;
  count: number;
  target: number;
}

const TasbihCounter = () => {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState<number>(0);
  const [vibrate, setVibrate] = useState(true);
  const [sound, setSound] = useState(true);

  const dhikrList: Dhikr[] = [
    {
      id: 1,
      arabic: 'سُبْحَانَ اللّٰهِ',
      bengali: 'সুবহানাল্লাহ',
      count: 0,
      target: 33
    },
    {
      id: 2,
      arabic: 'اَلْحَمْدُ لِلّٰهِ',
      bengali: 'আলহামদুলিল্লাহ',
      count: 0,
      target: 33
    },
    {
      id: 3,
      arabic: 'اللّٰهُ أَكْبَرُ',
      bengali: 'আল্লাহু আকবার',
      count: 0,
      target: 34
    },
    {
      id: 4,
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      bengali: 'লা ইলাহা ইল্লাল্লাহ',
      count: 0,
      target: 100
    }
  ];

  const handleCount = () => {
    setCount(prev => {
      const newCount = prev + 1;
      
      // Vibration feedback
      if (vibrate && window.navigator.vibrate) {
        if (newCount === dhikrList[selectedDhikr].target) {
          window.navigator.vibrate([200]); // Longer vibration for target completion
        } else {
          window.navigator.vibrate([50]); // Short vibration for each count
        }
      }

      // Sound feedback
      if (sound) {
        const audio = new Audio('/click.mp3');
        audio.play().catch(() => {});
      }

      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-[#4E5BA1] rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 text-white">
          <h1 className="text-2xl font-bold mb-4">ডিজিটাল তাসবিহ</h1>
          
          {/* Settings */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setVibrate(!vibrate)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                vibrate ? 'bg-white text-[#4E5BA1]' : 'bg-white/20'
              }`}
            >
              <span className="text-lg">📳</span>
              <span className="text-sm">কম্পন</span>
            </button>
            <button
              onClick={() => setSound(!sound)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                sound ? 'bg-white text-[#4E5BA1]' : 'bg-white/20'
              }`}
            >
              <span className="text-lg">🔊</span>
              <span className="text-sm">শব্দ</span>
            </button>
          </div>

          {/* Dhikr Selection */}
          <div className="grid grid-cols-2 gap-2">
            {dhikrList.map((dhikr, index) => (
              <button
                key={dhikr.id}
                onClick={() => {
                  setSelectedDhikr(index);
                  setCount(0);
                }}
                className={`p-2 rounded-lg text-center transition-colors ${
                  selectedDhikr === index
                    ? 'bg-white text-[#4E5BA1]'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="text-lg font-arabic">{dhikr.arabic}</div>
                <div className="text-sm">{dhikr.bengali}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="bg-white p-6">
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-[#4E5BA1] mb-2">
              {count}
            </div>
            <div className="text-gray-500">
              লক্ষ্যমাত্রা: {dhikrList[selectedDhikr].target}
            </div>
          </div>

          {/* Counter Button */}
          <button
            onClick={handleCount}
            className="w-32 h-32 rounded-full bg-[#4E5BA1] text-white mx-auto block
                     shadow-lg active:shadow-sm active:transform active:scale-95
                     transition-all duration-150"
          >
            <span className="text-4xl">+</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetCount}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-600 rounded-full
                     mx-auto block hover:bg-gray-300 transition-colors"
          >
            রিসেট
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasbihCounter;
