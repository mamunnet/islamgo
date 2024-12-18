import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import './QuranReader.css';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  bengaliName?: string;
  numberOfAyahs: number;
}

interface Verse {
  number: number;
  text: string;
  translation: string;
  bengaliTranslation: string;
  audio?: string;
}

const QuranReader = () => {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [showArabic, setShowArabic] = useState(true);
  const [showBengali, setShowBengali] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'verse' | 'text'>('verse');
  const [verseNumber, setVerseNumber] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Bengali names for surahs
  const bengaliSurahNames: { [key: number]: string } = {
    1: 'আল-ফাতিহা',
    2: 'আল-বাকারা',
    3: 'আল-ইমরান',
    4: 'আন-নিসা',
    5: 'আল-মায়িদাহ',
    6: 'আল-আনআম',
    7: 'আল-আরাফ',
    8: 'আল-আনফাল',
    9: 'আত-তাওবাহ',
    10: 'ইউনুস',
    11: 'হুদ',
    12: 'ইউসুফ',
    13: 'আর-রাদ',
    14: 'ইবরাহীম',
    15: 'আল-হিজর',
    16: 'আন-নাহল',
    17: 'আল-ইসরা',
    18: 'আল-কাহফ',
    19: 'মারইয়াম',
    20: 'ত্বা-হা',
    21: 'আল-আম্বিয়া',
    22: 'আল-হাজ্জ',
    23: 'আল-মুমিনুন',
    24: 'আন-নূর',
    25: 'আল-ফুরকান',
    26: 'আশ-শুআরা',
    27: 'আন-নামল',
    28: 'আল-কাসাস',
    29: 'আল-আনকাবুত',
    30: 'আর-রূম',
    31: 'লুকমান',
    32: 'আস-সাজদাহ',
    33: 'আল-আহযাব',
    34: 'সাবা',
    35: 'ফাতির',
    36: 'ইয়াসীন',
    37: 'আস-সাফফাত',
    38: 'সোয়াদ',
    39: 'আয-যুমার',
    40: 'গাফির',
    41: 'ফুসসিলাত',
    42: 'আশ-শূরা',
    43: 'আয-যুখরুফ',
    44: 'আদ-দুখান',
    45: 'আল-জাসিয়াহ',
    46: 'আল-আহকাফ',
    47: 'মুহাম্মাদ',
    48: 'আল-ফাতহ',
    49: 'আল-হুজুরাত',
    50: 'ক্বাফ',
    51: 'আয-যারিয়াত',
    52: 'আত-তূর',
    53: 'আন-নাজম',
    54: 'আল-কামার',
    55: 'আর-রাহমান',
    56: 'আল-ওয়াকিয়াহ',
    57: 'আল-হাদীদ',
    58: 'আল-মুজাদালাহ',
    59: 'আল-হাশর',
    60: 'আল-মুমতাহিনাহ',
    61: 'আস-সাফ',
    62: 'আল-জুমুআহ',
    63: 'আল-মুনাফিকুন',
    64: 'আত-তাগাবুন',
    65: 'আত-তালাক',
    66: 'আত-তাহরীম',
    67: 'আল-মুলক',
    68: 'আল-কলম',
    69: 'আল-হাক্কাহ',
    70: 'আল-মাআরিজ',
    71: 'নূহ',
    72: 'আল-জিন',
    73: 'আল-মুযযাম্মিল',
    74: 'আল-মুদ্দাসসির',
    75: 'আল-কিয়ামাহ',
    76: 'আল-ইনসান',
    77: 'আল-মুরসালাত',
    78: 'আন-নাবা',
    79: 'আন-নাযিআত',
    80: 'আবাসা',
    81: 'আত-তাকভীর',
    82: 'আল-ইনফিতার',
    83: 'আল-মুতাফফিফীন',
    84: 'আল-ইনশিকাক',
    85: 'আল-বুরূজ',
    86: 'আত-তারিক',
    87: 'আল-আলা',
    88: 'আল-গাশিয়াহ',
    89: 'আল-ফাজর',
    90: 'আল-বালাদ',
    91: 'আশ-শামস',
    92: 'আল-লাইল',
    93: 'আদ-দুহা',
    94: 'আশ-শারহ',
    95: 'আত-তীন',
    96: 'আল-আলাক',
    97: 'আল-কদর',
    98: 'আল-বাইয়্যিনাহ',
    99: 'আয-যিলযাল',
    100: 'আল-আদিয়াত',
    101: 'আল-কারিয়াহ',
    102: 'আত-তাকাসুর',
    103: 'আল-আসর',
    104: 'আল-হুমাযাহ',
    105: 'আল-ফীল',
    106: 'কুরাইশ',
    107: 'আল-মাউন',
    108: 'আল-কাওসার',
    109: 'আল-কাফিরুন',
    110: 'আন-নাসর',
    111: 'আল-লাহাব',
    112: 'আল-ইখলাস',
    113: 'আল-ফালাক',
    114: 'আন-নাস'
  };

  const { data: surahs } = useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      return response.data.data.map((surah: Surah) => ({
        ...surah,
        bengaliName: bengaliSurahNames[surah.number]
      }));
    }
  });

  const { data: verses, isLoading } = useQuery({
    queryKey: ['verses', selectedSurah],
    queryFn: async () => {
      const [arabicResponse, bengaliResponse] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${selectedSurah}`),
        axios.get(`https://api.alquran.cloud/v1/surah/${selectedSurah}/bn.bengali`)
      ]);

      return arabicResponse.data.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: bengaliResponse.data.data.ayahs[index].text,
        audio: ayah.audio
      }));
    }
  });

  // Filter verses based on search
  const filteredVerses = verses?.filter((verse: Verse) => {
    if (!searchQuery && !verseNumber) return true;
    
    if (searchBy === 'verse' && verseNumber) {
      return verse.number.toString() === verseNumber;
    }
    
    const searchLower = searchQuery.toLowerCase();
    return (
      verse.text.toLowerCase().includes(searchLower) ||
      verse.translation.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="quran-reader">
      {/* Header Section */}
      <div className="bg-[#4E5BA1] text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">আল-কুরআন</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowArabic(!showArabic)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showArabic ? 'bg-white text-[#4E5BA1]' : 'bg-white/20'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setShowBengali(!showBengali)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showBengali ? 'bg-white text-[#4E5BA1]' : 'bg-white/20'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Surah Selection */}
        <select
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(Number(e.target.value))}
          className="w-full p-2 rounded-lg bg-white text-[#4E5BA1] border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 mb-4"
        >
          {surahs?.map((surah: Surah) => (
            <option key={surah.number} value={surah.number} className="text-[#4E5BA1] bg-white">
              {surah.bengaliName} ({surah.englishName})
            </option>
          ))}
        </select>

        {/* Search Controls */}
        <div className="space-y-2">
          <div className="flex gap-4 justify-center">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={searchBy === 'verse'}
                onChange={() => setSearchBy('verse')}
                className="text-[#4E5BA1]"
              />
              <span>আয়াত নম্বর</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={searchBy === 'text'}
                onChange={() => setSearchBy('text')}
                className="text-[#4E5BA1]"
              />
              <span>পাঠ্য অনুসন্ধান</span>
            </label>
          </div>

          {searchBy === 'text' ? (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আয়াত খুঁজুন..."
              className="w-full p-2 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          ) : (
            <input
              type="number"
              value={verseNumber}
              onChange={(e) => setVerseNumber(e.target.value)}
              placeholder="আয়াত নম্বর লিখুন"
              min="1"
              className="w-full p-2 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}
        </div>
      </div>

      {/* Verses Section */}
      <div className="bg-white rounded-b-lg shadow-md">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#4E5BA1] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredVerses?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            কোন আয়াত পাওয়া যায়নি
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredVerses?.map((verse: Verse) => (
              <div key={verse.number} className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#4E5BA1]/10 text-[#4E5BA1] px-3 py-1 rounded-full text-sm font-medium">
                    আয়াত {verse.number}
                  </span>
                  <button
                    onClick={() => {
                      setAudioSrc(verse.audio || '');
                      setIsPlaying(true);
                    }}
                    className="text-gray-500 hover:text-[#4E5BA1] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                {showArabic && (
                  <p className="text-right font-arabic text-2xl leading-loose mb-4 text-gray-900">
                    {verse.text}
                  </p>
                )}

                {showBengali && (
                  <p className="text-gray-600 leading-relaxed">
                    {verse.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        autoPlay={isPlaying}
      />
    </div>
  );
};

export default QuranReader;
