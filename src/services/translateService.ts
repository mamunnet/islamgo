import axios from 'axios';

// Common Islamic terms and their Bengali translations
const commonTerms: { [key: string]: string } = {
  'Allah': 'আল্লাহ',
  'Islam': 'ইসলাম',
  'Prophet': 'নবী',
  'Muhammad': 'মুহাম্মদ',
  'peace be upon him': 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম',
  'PBUH': 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম',
  '(ﷺ)': 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম',
  'prayer': 'নামায',
  'Prayer': 'নামায',
  'Salah': 'নামায',
  'Salat': 'নামায',
  'mosque': 'মসজিদ',
  'Quran': 'কুরআন',
  'faith': 'ঈমান',
  'Faith': 'ঈমান',
  'Iman': 'ঈমান',
  'believer': 'মুমিন',
  'Believer': 'মুমিন',
  'paradise': 'জান্নাত',
  'Paradise': 'জান্নাত',
  'Jannah': 'জান্নাত',
  'hell': 'জাহান্নাম',
  'Hell': 'জাহান্নাম',
  'Jahannam': 'জাহান্নাম',
  'good deed': 'নেক আমল',
  'Good deed': 'নেক আমল',
  'sin': 'গুনাহ',
  'Sin': 'গুনাহ',
  'charity': 'সদকা',
  'Charity': 'সদকা',
  'Sadaqah': 'সদকা',
  'fasting': 'রোজা',
  'Fasting': 'রোজা',
  'Sawm': 'রোজা',
  'Ramadan': 'রমজান',
  'Zakat': 'যাকাত',
  'Hajj': 'হজ্জ',
  'Pilgrimage': 'হজ্জ'
};

const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyCX9RIhn5MhPhSaBMxky8d_qgfkiRs765A';
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

export const translateText = async (text: string, targetLang: string = 'bn') => {
  if (!text) return '';
  
  try {
    // First replace common Islamic terms
    let translatedText = text;
    for (const [term, translation] of Object.entries(commonTerms)) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translation);
    }

    // Use Google Translate API
    const response = await axios.post<TranslationResponse>(GOOGLE_TRANSLATE_URL, null, {
      params: {
        q: translatedText,
        target: targetLang,
        key: GOOGLE_TRANSLATE_API_KEY
      }
    });

    const translation = response.data?.data?.translations?.[0]?.translatedText;
    if (translation) {
      translatedText = translation;

      // Post-process the translation
      translatedText = translatedText
        // Fix spacing around parentheses
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        // Convert English periods to Bengali full stops
        .replace(/\./g, '।')
        // Fix spacing around punctuation
        .replace(/\s+([।,!?])/g, '$1')
        // Clean up extra spaces
        .replace(/\s+/g, ' ')
        .trim();

      return translatedText;
    }

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return a user-friendly error message instead of throwing
    return 'দুঃখিত, অনুবাদ করা সম্ভব হয়নি। পরে আবার চেষ্টা করুন।';
  }
};