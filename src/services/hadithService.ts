import axios from 'axios';

const API_KEY = '$2y$10$gQNgqB2jzu3yav7HyX71HOVoH3yjGyxMagMJtmgu8XmHkP8ymn0o2';
const API_BASE = 'https://www.hadithapi.com/api';

// Predefined book slugs
export const BOOK_SLUGS = {
  'sahih-bukhari': 'Sahih Bukhari',
  'sahih-muslim': 'Sahih Muslim',
  'al-tirmidhi': "Jami' Al-Tirmidhi",
  'abu-dawood': 'Sunan Abu Dawood',
  'ibn-e-majah': 'Sunan Ibn-e-Majah',
  'sunan-nasai': "Sunan An-Nasa'i",
  'mishkat': 'Mishkat Al-Masabih',
  'musnad-ahmad': 'Musnad Ahmad',
  'al-silsila-sahiha': 'Al-Silsila Sahiha'
};

// Book information with hadith counts and Bengali titles
export interface BookInfo {
  name: string;
  nameBn: string;
  hadithCount: number;
}

export const BOOK_INFO: { [key: string]: BookInfo } = {
  'sahih-bukhari': {
    name: 'Sahih Bukhari',
    nameBn: 'সহীহ বুখারী',
    hadithCount: 7563
  },
  'sahih-muslim': {
    name: 'Sahih Muslim',
    nameBn: 'সহীহ মুসলিম',
    hadithCount: 7470
  },
  'al-tirmidhi': {
    name: "Jami' Al-Tirmidhi",
    nameBn: 'জামে তিরমিযী',
    hadithCount: 3956
  },
  'abu-dawood': {
    name: 'Sunan Abu Dawood',
    nameBn: 'সুনান আবু দাউদ',
    hadithCount: 5274
  },
  'ibn-e-majah': {
    name: 'Sunan Ibn-e-Majah',
    nameBn: 'সুনান ইবনে মাজাহ',
    hadithCount: 4341
  },
  'sunan-nasai': {
    name: "Sunan An-Nasa'i",
    nameBn: 'সুনান নাসাঈ',
    hadithCount: 5758
  },
  'mishkat': {
    name: 'Mishkat Al-Masabih',
    nameBn: 'মিশকাত শরীফ',
    hadithCount: 6287
  },
  'musnad-ahmad': {
    name: 'Musnad Ahmad',
    nameBn: 'মুসনাদ আহমাদ',
    hadithCount: 28199
  },
  'al-silsila-sahiha': {
    name: 'Al-Silsila Sahiha',
    nameBn: 'সিলসিলা সহীহাহ',
    hadithCount: 4035
  }
};

// Book categories with hadith counts
export const HADITH_CATEGORIES = {
  'revelation': {
    name: 'Revelation',
    nameBn: 'অহী',
    count: 7
  },
  'belief': {
    name: 'Belief',
    nameBn: 'ঈমান',
    count: 63
  },
  'knowledge': {
    name: 'Knowledge',
    nameBn: 'ইলম',
    count: 75
  },
  'ablutions': {
    name: 'Ablutions',
    nameBn: 'ওযু',
    count: 113
  }
};

export interface HadithBook {
  id: number;
  slug: string;
  title: string;
  titleAr?: string;
  titleBn: string;
  numberOfHadith: number;
  abvrCode?: string;
  bookName: string;
  chapterCount: number;
}

export interface HadithChapter {
  id: number;
  chapterId: string;
  title: string;
  titleAr: string;
  titleBn: string;
  bookSlug: string;
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

export interface HadithResponse {
  id: number;
  bookSlug: string;
  chapterId: string;
  hadithNumber: number;
  hadithUrl: string;
  narrator: string;
  narratorBn: string;
  body: string;
  bodyAr: string;
  bodyBn: string;
  grade: string;
  gradeBn: string;
}

// Fetch available hadith books
export const fetchHadithBooks = async () => {
  try {
    console.log('Fetching hadith books');
    // Since the API doesn't provide Bengali translations and accurate hadith counts,
    // we'll use our predefined information
    return Object.entries(BOOK_INFO).map(([slug, info], index) => ({
      id: index + 1,
      slug,
      title: info.name,
      titleBn: info.nameBn,
      numberOfHadith: info.hadithCount,
      bookName: info.name,
      chapterCount: 0 // This will be updated when chapters are loaded
    }));
  } catch (error: any) {
    console.error('Error fetching books:', error.response?.data || error.message);
    return [];
  }
};

// Fetch chapters of a specific book
export const fetchBookChapters = async (bookSlug: string) => {
  try {
    console.log('Fetching chapters for book:', bookSlug);
    const response = await axios.get(`${API_BASE}/${bookSlug}/chapters`, {
      params: { 
        apiKey: API_KEY
      }
    });

    console.log('Chapters API Response:', response.data);

    if (!response.data || !response.data.chapters) {
      console.error('Invalid chapters response:', response.data);
      return [];
    }

    return response.data.chapters.map((chapter: any) => ({
      id: chapter.id || 0,
      chapterId: (chapter.id || chapter.chapter_id || '').toString(),
      title: chapter.chapterEnglish || chapter.title || '',
      titleAr: chapter.chapterArabic || chapter.titleAr || chapter.title_ar || '',
      titleBn: chapter.chapterBengali || chapter.chapterBangla || chapter.titleBn || chapter.title_bn || chapter.chapterEnglish || '',
      bookSlug: bookSlug,
      hadithStartNumber: chapter.hadithStartNumber || chapter.hadith_start || 0,
      hadithEndNumber: chapter.hadithEndNumber || chapter.hadith_end || 0,
      numberOfHadith: chapter.numberOfHadith || chapter.number_of_hadith || chapter.hadithCount || 0
    }));
  } catch (error: any) {
    console.error('Error fetching chapters:', error.response?.data || error.message);
    return [];
  }
};

// Fetch book categories (using chapters endpoint)
export const fetchBookCategories = async (bookSlug: string) => {
  try {
    console.log('Fetching categories for book:', bookSlug);
    const response = await axios.get(`${API_BASE}/${bookSlug}/chapters`, {
      params: { 
        apiKey: API_KEY
      }
    });

    console.log('Categories API Response:', response.data);

    if (!response.data || !response.data.chapters) {
      console.error('Invalid categories response:', response.data);
      return [];
    }

    // Map chapters to categories
    return response.data.chapters
      .filter((chapter: any) => chapter.chapterNumber <= 4) // Get first 4 chapters for categories
      .map((chapter: any) => ({
        id: chapter.chapterNumber || chapter.id,
        name: chapter.chapterEnglish || chapter.title || '',
        nameBn: chapter.chapterBengali || chapter.chapterBangla || chapter.titleBn || '',
        count: chapter.numberOfHadith || 0,
        bookSlug
      }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch hadiths with pagination and filters
export const fetchHadiths = async (
  bookSlug?: string,
  chapterId?: string,
  page: number = 1,
  limit: number = 25
) => {
  try {
    const params: any = {
      apiKey: API_KEY,
      paginate: limit,
      page
    };

    if (bookSlug) {
      params.book = bookSlug;
    }

    if (chapterId) {
      params.chapter = chapterId;
    }

    console.log('Fetching hadiths with params:', params);
    const response = await axios.get(`${API_BASE}/hadiths`, { params });
    
    if (!response.data) {
      console.error('No data received from API');
      throw new Error('No data received from API');
    }

    console.log('Hadiths API Response:', response.data);

    // The API returns data in the hadiths object
    const hadithsData = response.data.hadiths?.data || [];
    
    if (hadithsData.length === 0) {
      console.error('No hadiths found in response');
      throw new Error('No hadiths found');
    }

    // Log the first hadith to see its structure
    console.log('Sample hadith structure:', hadithsData[0]);

    return {
      hadiths: hadithsData.map((hadith: any) => {
        const mappedHadith = {
          id: hadith.id,
          bookSlug: bookSlug,
          chapterId: chapterId,
          hadithNumber: hadith.hadithNumber,
          hadithUrl: hadith.hadithUrl,
          narrator: hadith.englishNarrator || '',
          narratorBn: translateNarrator(hadith.englishNarrator) || '',
          body: hadith.hadithEnglish || '',
          bodyAr: hadith.hadithArabic || '',
          bodyBn: hadith.hadithBengali || translateHadith(hadith.hadithEnglish) || '',
          grade: hadith.grade || hadith.status || '',
          gradeBn: translateGrade(hadith.grade || hadith.status) || ''
        };
        
        console.log('Mapped hadith:', mappedHadith);
        return mappedHadith;
      }),
      pagination: {
        currentPage: response.data.hadiths?.current_page || page,
        lastPage: response.data.hadiths?.last_page || 1,
        perPage: response.data.hadiths?.per_page || limit,
        total: response.data.hadiths?.total || (bookSlug ? BOOK_INFO[bookSlug as keyof typeof BOOK_INFO]?.hadithCount : 0)
      }
    };
  } catch (error: any) {
    console.error('Error fetching hadiths:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to get book info
export const getBookInfo = (bookSlug: string): BookInfo | null => {
  return BOOK_INFO[bookSlug as keyof typeof BOOK_INFO] || null;
};

// Helper function to get English translation
export const getEnglishTranslation = async (hadithId: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE}/hadiths/${hadithId}/translations/en`, {
      headers: { 'x-api-key': API_KEY }
    });
    return response.data.translation || '';
  } catch (error) {
    console.error('Error fetching English translation:', error);
    return '';
  }
};

// Helper function to translate narrator names to Bengali
export function translateNarrator(englishNarrator: string = ''): string {
  const narratorMap: { [key: string]: string } = {
    'Abu Hurairah': 'আবু হুরায়রা',
    'Aisha': 'আয়েশা',
    // Add more mappings as needed
  };
  return narratorMap[englishNarrator] || englishNarrator;
}

// Helper function to translate hadith grades to Bengali
function translateGrade(grade: string = ''): string {
  const gradeTranslations: { [key: string]: string } = {
    'Sahih': 'সহীহ',
    'Hasan': 'হাসান',
    "Da'if": 'দুর্বল',
    'Daif': 'দুর্বল',
    'Maudu': 'মাউদু',
    // Add more grade translations as needed
  };

  return gradeTranslations[grade] || grade;
}

// Helper function to translate hadith text to Bengali
// TODO: Implement proper translation service integration
function translateHadith(englishText: string = ''): string {
  // Return the original text until translation service is implemented
  return englishText;
}
