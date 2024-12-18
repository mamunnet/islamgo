import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Verse {
  text: string;
  surah: string;
  ayah: number;
  translation: string;
}

const DailyVerse = () => {
  const { data: verse, isLoading } = useQuery({
    queryKey: ['dailyVerse'],
    queryFn: async () => {
      // Get a random verse (1-6236 total verses in Quran)
      const randomVerseNumber = Math.floor(Math.random() * 6236) + 1;
      
      const response = await axios.get(
        `http://api.alquran.cloud/v1/ayah/${randomVerseNumber}/editions/quran-simple,en.asad`
      );
      
      const arabicVerse = response.data.data[0];
      const englishVerse = response.data.data[1];
      
      return {
        text: arabicVerse.text,
        surah: arabicVerse.surah.name,
        ayah: arabicVerse.numberInSurah,
        translation: englishVerse.text,
      };
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-islamic-green-800 mb-4">
        Daily Verse
      </h2>
      <div className="bg-islamic-green-50 rounded-lg p-6">
        <div className="text-2xl text-right font-arabic mb-4">{verse?.text}</div>
        <div className="text-gray-700 mb-4">{verse?.translation}</div>
        <footer className="text-islamic-green-600 text-sm font-medium">
          Surah {verse?.surah}, Verse {verse?.ayah}
        </footer>
      </div>
    </div>
  );
};

export default DailyVerse;
