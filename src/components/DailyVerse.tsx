import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Verse {
  text: string;
  translation: string;
  chapter: string;
  verse: string;
  bengaliChapter: string;
}

const DailyVerse: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery<Verse>({
    queryKey: ['dailyVerse'],
    queryFn: async () => {
      // Get a random surah number (1-114)
      const surahNumber = Math.floor(Math.random() * 114) + 1;
      
      // First get the surah to know how many ayahs it has
      const surahResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const numberOfAyahs = surahResponse.data.data.numberOfAyahs;
      
      // Get a random ayah number from this surah
      const ayahNumber = Math.floor(Math.random() * numberOfAyahs) + 1;
      
      // Get the verse in multiple languages
      const response = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,bn.bengali`
      );

      const arabicVerse = response.data.data[0];
      const bengaliVerse = response.data.data[1];

      return {
        text: arabicVerse.text,
        translation: bengaliVerse.text,
        chapter: arabicVerse.surah.englishName,
        bengaliChapter: arabicVerse.surah.name,
        verse: `${arabicVerse.surah.number}:${arabicVerse.numberInSurah}`
      };
    }
  });

  const handleShare = async () => {
    if (!data) return;

    const shareText = `
${data.text}

${data.translation}

- সূরা ${data.bengaliChapter}, আয়াত ${data.verse}

#IslamGo #DailyVerse`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'আজকের আয়াত - IslamGo',
          text: shareText
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      // You might want to show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-color-primary text-white p-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">আজকের আয়াত</h2>
            <button className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors" disabled>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-color-primary text-white p-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">আজকের আয়াত</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => refetch()}
                className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="text-red-500">Error loading verse</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with Refresh Button */}
      <div className="bg-color-primary text-white p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">আজকের আয়াত</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
              title="Share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button 
              onClick={() => refetch()}
              className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Verse Content */}
      {data && (
        <div className="p-3 space-y-3">
          {/* Arabic Text */}
          <div className="text-right">
            <p className="text-lg font-arabic text-gray-800 leading-relaxed">{data.text}</p>
          </div>

          {/* Bengali Translation */}
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">{data.translation}</p>
          </div>

          {/* Reference */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-color-primary font-medium">{data.bengaliChapter}</span>
            <span className="text-gray-500">আয়াত {data.verse}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyVerse;
