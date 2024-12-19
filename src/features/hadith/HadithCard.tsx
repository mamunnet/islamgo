import { useState } from 'react';
import { HadithResponse } from '../../services/hadithService';
import { translateText } from '../../services/translateService';

interface HadithCardProps {
  hadith: HadithResponse;
  bookSlug: string;
}

const HadithCard = ({ hadith, bookSlug }: HadithCardProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslate = async () => {
    if (!translatedText) {
      setIsTranslating(true);
      const translated = await translateText(hadith.body || '');
      setTranslatedText(translated);
      setShowTranslation(true);
      setIsTranslating(false);
    } else {
      setShowTranslation(!showTranslation);
    }
  };

  return (
    <div className="p-6 hover:bg-black/40 transition-colors backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white">হাদিস নং {hadith.hadithNumber}</h3>
        <div className="flex items-center gap-2">
          {hadith.grade && (
            <span className="text-sm px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded-full">
              {hadith.gradeBn || hadith.grade}
            </span>
          )}
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`px-3 py-1 rounded-full text-sm ${
              isTranslating 
                ? 'bg-black/30 text-white/50' 
                : 'bg-black/30 text-white hover:bg-black/40'
            }`}
          >
            {isTranslating ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                অনুবাদ হচ্ছে...
              </span>
            ) : (
              'বাংলায় অনুবাদ করুন'
            )}
          </button>
        </div>
      </div>

      {hadith.narratorBn && (
        <div className="mb-4 text-yellow-300/90">
          <strong>বর্ণনায়:</strong> {hadith.narratorBn}
        </div>
      )}

      {hadith.bodyAr && (
        <div className="text-right mb-4 font-arabic text-2xl leading-loose text-white dir-rtl">
          {hadith.bodyAr}
        </div>
      )}
      
      <p className="text-white/80 mb-3 leading-relaxed whitespace-pre-line text-lg">
        {showTranslation ? translatedText : (hadith.bodyBn || hadith.body)}
      </p>
      
      <div className="text-sm text-white/60 flex items-center justify-between border-t border-white/10 pt-4 mt-4">
        <div>Reference: {bookSlug} {hadith.hadithNumber}</div>
        {translatedText && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-yellow-300/90 hover:text-yellow-300 text-sm transition-colors"
            >
              {showTranslation ? 'মূল টেক্সট দেখুন' : 'অনুবাদ দেখুন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HadithCard;