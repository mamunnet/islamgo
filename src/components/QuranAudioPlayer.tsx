import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAudio } from '../context/AudioContext';
import type { AudioState } from '../context/AudioContext';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  bengaliName?: string;
}

const QuranAudioPlayer = () => {
  const { audioState, setAudioState } = useAudio();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (audioState.isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [audioState.isPlaying]);

  useEffect(() => {
    if (duration) {
      // Handle duration changes
      console.log('Duration:', duration);
    }
  }, [duration]);

  useEffect(() => {
    if (currentTime) {
      // Handle current time changes
      console.log('Current Time:', currentTime);
    }
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current) {
      // Handle audio ref
      console.log('Audio element loaded');
    }
  }, [audioRef]);

  // Complete Bengali names for surahs
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
    46: 'আল-আহক্বাফ',
    47: 'মুহাম্মাদ',
    48: 'আল-ফাতহ',
    49: 'আল-হুজুরাত',
    50: 'ক্বাফ',
    51: 'আয-যারিয়াত',
    52: 'আত-তূর',
    53: 'আন-নাজম',
    54: 'আল-ক্বামার',
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

  const handlePlayPause = () => {
    setAudioState((prev: AudioState) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSurahChange = (surahNumber: number) => {
    setAudioState((prev: AudioState) => ({ ...prev, currentSurah: surahNumber }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Update audio URL when surah changes
    const surahUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${audioState.currentSurah}.mp3`;
    setAudioState((prev: AudioState) => ({ ...prev, audioUrl: surahUrl }));
  }, [audioState.currentSurah]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-[#4E5BA1] mb-2">সম্পূর্ণ সূরা শুনুন</h2>
        
        {/* Surah Selection */}
        <select
          value={audioState.currentSurah}
          onChange={(e) => handleSurahChange(Number(e.target.value))}
          className="w-full p-2 rounded-lg bg-white text-[#4E5BA1] border border-[#4E5BA1]/20 focus:outline-none focus:ring-2 focus:ring-[#4E5BA1]/30"
        >
          {surahs?.map((surah: Surah) => (
            <option key={surah.number} value={surah.number}>
              {`${surah.number}. ${bengaliSurahNames[surah.number] || surah.englishName}`}
            </option>
          ))}
        </select>

        {/* Audio Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {audioState.isPlaying ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </>
              )}
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="flex-1 space-y-1">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        <audio ref={audioRef} src={audioState.audioUrl} />
      </div>
    </div>
  );
};

export default QuranAudioPlayer;
