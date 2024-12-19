import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface Prayer {
  name: string;
  banglaName: string;
  time: string;
  completed: boolean;
}

interface PrayerStore {
  prayers: Record<string, Prayer[]>;
  addPrayer: (date: string, prayers: Prayer[]) => void;
  markPrayer: (date: string, prayerName: string, completed: boolean) => void;
}

const usePrayerStore = create<PrayerStore>()(
  persist(
    (set) => ({
      prayers: {},
      addPrayer: (date, prayers) =>
        set((state) => ({
          prayers: { ...state.prayers, [date]: prayers },
        })),
      markPrayer: (date, prayerName, completed) =>
        set((state) => ({
          prayers: {
            ...state.prayers,
            [date]: state.prayers[date]?.map((prayer) =>
              prayer.name === prayerName ? { ...prayer, completed } : prayer
            ),
          },
        })),
    }),
    {
      name: 'prayer-storage',
    }
  )
);

const PrayerTracking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { prayers, addPrayer, markPrayer } = usePrayerStore();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!prayers[dateStr]) {
      const defaultPrayers: Prayer[] = [
        { name: 'Fajr', banglaName: 'ফজর', time: '', completed: false },
        { name: 'Dhuhr', banglaName: 'যোহর', time: '', completed: false },
        { name: 'Asr', banglaName: 'আসর', time: '', completed: false },
        { name: 'Maghrib', banglaName: 'মাগরিব', time: '', completed: false },
        { name: 'Isha', banglaName: 'ইশা', time: '', completed: false },
      ];
      addPrayer(dateStr, defaultPrayers);
    }
  }, [dateStr]);

  const handlePrayerToggle = (prayerName: string, completed: boolean) => {
    markPrayer(dateStr, prayerName, completed);
    toast.success(
      `${prayerName} নামাজ ${completed ? 'আদায় করা হয়েছে' : 'আদায় করা হয়নি'}`
    );
  };

  const calculateStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayPrayers = prayers[today] || [];
    const completed = todayPrayers.filter((p) => p.completed).length;
    const total = todayPrayers.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#4E5BA1] text-white p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">নামাজ ট্র্যাকিং</h2>
          <input
            type="date"
            className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">আজকের অগ্রগতি</span>
          <span className="text-sm font-medium text-[#4E5BA1]">
            {stats.completed}/{stats.total} নামাজ
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4E5BA1] transition-all duration-300"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Prayer List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-3">
        {prayers[dateStr]?.map((prayer) => (
          <div
            key={prayer.name}
            className={`rounded-lg p-3 transition-all duration-300 ${
              prayer.completed
                ? 'bg-[#4E5BA1]/10 border-[#4E5BA1]/20'
                : 'bg-gray-50 border-gray-100'
            } border`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {prayer.banglaName}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={prayer.completed}
                  onChange={(e) => handlePrayerToggle(prayer.name, e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4E5BA1]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4E5BA1]"></div>
              </label>
            </div>
            {prayer.time && (
              <span className="text-xs text-gray-500">সময়: {prayer.time}</span>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Stats */}
      <div className="border-t bg-gray-50/50 p-3">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>সাপ্তাহিক লক্ষ্য: ৩৫/৩৫</span>
          <span>মাসিক লক্ষ্য: ১৪০/১৫০</span>
        </div>
      </div>
    </div>
  );
};

export default PrayerTracking;
