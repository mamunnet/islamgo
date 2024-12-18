import { useState } from 'react';

const islamicMonths = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

const importantDates: { [key: string]: string } = {
  '10-1': 'Ashura',
  '12-3': 'Mawlid al-Nabi',
  '27-7': 'Laylat al-Miraj',
  '15-8': 'Laylat al-Bara\'at',
  '1-9': 'Beginning of Ramadan',
  '27-9': 'Laylat al-Qadr',
  '1-10': 'Eid al-Fitr',
  '10-12': 'Eid al-Adha'
};

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const getHijriDate = (date: Date): HijriDate => {
  // Simple Hijri date calculation
  const gregorianDate = new Date(date);
  const epochTime = gregorianDate.getTime() - gregorianDate.getTimezoneOffset() * 60 * 1000;
  const hijriEpoch = new Date('622-07-16').getTime();
  const daysSinceHijri = Math.floor((epochTime - hijriEpoch) / (1000 * 60 * 60 * 24));
  const hijriYear = Math.floor((daysSinceHijri - 1) / 354.367) + 1;
  const daysInCurrentYear = daysSinceHijri - Math.floor(354.367 * (hijriYear - 1));
  const hijriMonth = Math.min(Math.floor(daysInCurrentYear / 29.5), 11);
  const hijriDay = Math.floor(daysInCurrentYear - (hijriMonth * 29.5)) + 1;

  return {
    day: Math.round(hijriDay),
    month: hijriMonth,
    year: hijriYear,
    monthName: islamicMonths[hijriMonth]
  };
};

const getGregorianDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const IslamicCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const hijriDate = getHijriDate(selectedDate);

  const getImportantEvent = (day: number, month: number) => {
    const key = `${day}-${month + 1}` as keyof typeof importantDates;
    return importantDates[key];
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">ইসলামিক ক্যালেন্ডার</h2>
        <input
          type="date"
          className="mt-4 p-2 border rounded bg-white bg-opacity-10 text-white"
          value={getGregorianDate(selectedDate)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      <div className="text-center space-y-2">
        <div className="text-3xl font-bold text-white">
          {hijriDate.day} {hijriDate.monthName} {hijriDate.year}
        </div>
        <div className="text-white text-opacity-80">
          {getGregorianDate(selectedDate)}
        </div>
      </div>

      {getImportantEvent(hijriDate.day, hijriDate.month) && (
        <div className="bg-color-primary bg-opacity-20 p-4 rounded-lg text-center">
          <span className="text-white font-medium">
            {getImportantEvent(hijriDate.day, hijriDate.month)}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {islamicMonths.map((month, index) => (
          <div
            key={month}
            className={`p-2 text-center rounded ${
              index === hijriDate.month
                ? 'bg-color-primary text-white'
                : 'bg-white bg-opacity-10 text-white'
            }`}
          >
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IslamicCalendar;
