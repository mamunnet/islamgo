import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface Prayer {
  name: string;
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
    // Initialize prayers for the day if not exists
    if (!prayers[dateStr]) {
      const defaultPrayers: Prayer[] = [
        { name: 'Fajr', time: '', completed: false },
        { name: 'Dhuhr', time: '', completed: false },
        { name: 'Asr', time: '', completed: false },
        { name: 'Maghrib', time: '', completed: false },
        { name: 'Isha', time: '', completed: false },
      ];
      addPrayer(dateStr, defaultPrayers);
    }
  }, [dateStr]);

  const handlePrayerToggle = (prayerName: string, completed: boolean) => {
    markPrayer(dateStr, prayerName, completed);
    toast.success(
      `${prayerName} prayer marked as ${completed ? 'completed' : 'not completed'}`
    );
  };

  const calculateStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayPrayers = prayers[today] || [];
    const completed = todayPrayers.filter((p) => p.completed).length;
    const total = todayPrayers.length;
    return { completed, total };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-islamic-green-800">Prayer Tracking</h2>
        <input
          type="date"
          className="p-2 border rounded"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      <div className="bg-islamic-green-50 p-4 rounded-lg">
        <div className="text-center">
          <p className="text-islamic-green-800">Today's Progress</p>
          <p className="text-2xl font-bold text-islamic-green-600">
            {stats.completed}/{stats.total} Prayers
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {prayers[dateStr]?.map((prayer) => (
          <div
            key={prayer.name}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium text-islamic-green-800">{prayer.name}</h3>
              {prayer.time && (
                <p className="text-sm text-gray-600">Time: {prayer.time}</p>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={prayer.completed}
                onChange={(e) => handlePrayerToggle(prayer.name, e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-islamic-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-islamic-green-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTracking;
