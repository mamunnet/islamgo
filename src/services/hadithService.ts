import axios from 'axios';

const API_BASE = '/api/hadith';

export interface HadithBook {
  id: string;
  name: string;
  nameBengali: string;
  book_key: string;
  available: boolean;
  totalChapters: number;
}

export interface HadithChapter {
  id: string;
  title: string;
  titleAr: string;
  chapterNumber: number;
  totalHadith: number;
  category: string;
  categoryBn: string;
}

export interface HadithResponse {
  id: string;
  title: string;
  text: string;
  arabic: string;
  reference: string;
  category: string;
  narrator: string;
  hadithNo: string;
}

// Predefined books with chapter counts and categories
const AVAILABLE_BOOKS: HadithBook[] = [
  { 
    id: 'bukhari',
    name: 'Sahih al-Bukhari',
    nameBengali: 'সহিহ বুখারী',
    book_key: 'bukhari',
    available: true,
    totalChapters: 97
  },
  { 
    id: 'muslim',
    name: 'Sahih Muslim',
    nameBengali: 'সহিহ মুসলিম',
    book_key: 'muslim',
    available: true,
    totalChapters: 56
  },
  { 
    id: 'abudawud',
    name: 'Sunan Abi Dawud',
    nameBengali: 'সুনান আবু দাউদ',
    book_key: 'abudawud',
    available: true,
    totalChapters: 43
  },
  { 
    id: 'tirmidhi',
    name: 'Jami at-Tirmidhi',
    nameBengali: 'জামে তিরমিযী',
    book_key: 'tirmidhi',
    available: true,
    totalChapters: 49
  }
];

// Categories in Bengali
const CATEGORIES_BENGALI: { [key: string]: string } = {
  'aqeedah': 'আকীদাহ',
  'iman': 'ঈমান',
  'knowledge': 'ইলম',
  'wudu': 'ওযূ',
  'ghusl': 'গোসল',
  'menstruation': 'হায়েয',
  'tayammum': 'তায়াম্মুম',
  'salah': 'সালাত',
  'salah_times': 'সালাতের সময়',
  'adhan': 'আযান',
  'jumuah': 'জুমুআ',
  'fear_prayer': 'সালাতুল খাওফ',
  'eid': 'ঈদ',
  'witr': 'বিতর',
  'purification': 'তাহারাত',
  'mosques': 'মসজিদ',
  'traveller_prayer': 'মুসাফির সালাত',
  'zakat': 'যাকাত',
  'fasting': 'সিয়াম',
  'hajj': 'হজ্জ',
  'umrah': 'উমরাহ',
  'marriage': 'বিবাহ',
  'divorce': 'তালাক',
  'trade': 'ব্যবসা',
  'inheritance': 'উত্তরাধিকার',
  'jihad': 'জিহাদ',
  'dua': 'দোয়া',
  'dhikr': 'যিকর',
  'quran': 'কুরআন',
  'tafsir': 'তাফসীর',
  'general': 'সাধারণ'
};

// Book chapters with categories
const BOOK_CHAPTERS = {
  bukhari: [
    { title: 'ওহীর সূচনা', titleAr: 'بدء الوحى', category: 'aqeedah', categoryBn: 'আকীদাহ' },
    { title: 'ঈমান', titleAr: 'الإيمان', category: 'iman', categoryBn: 'ঈমান' },
    { title: 'ইলম', titleAr: 'العلم', category: 'knowledge', categoryBn: 'ইলম' },
    { title: 'ওযূ', titleAr: 'الوضوء', category: 'wudu', categoryBn: 'ওযূ' },
    { title: 'গোসল', titleAr: 'الغسل', category: 'ghusl', categoryBn: 'গোসল' },
    { title: 'হায়েয', titleAr: 'الحيض', category: 'menstruation', categoryBn: 'হায়েয' },
    { title: 'তায়াম্মুম', titleAr: 'التيمم', category: 'tayammum', categoryBn: 'তায়াম্মুম' },
    { title: 'সালাত', titleAr: 'الصلاة', category: 'salah', categoryBn: 'সালাত' },
    { title: 'সালাতের সময়', titleAr: 'مواقيت الصلاة', category: 'salah_times', categoryBn: 'সালাতের সময়' },
    { title: 'আযান', titleAr: 'الأذان', category: 'adhan', categoryBn: 'আযান' },
    { title: 'জুমুআ', titleAr: 'الجمعة', category: 'jumuah', categoryBn: 'জুমুআ' },
    { title: 'সালাতুল খাওফ', titleAr: 'صلاة الخوف', category: 'fear_prayer', categoryBn: 'সালাতুল খাওফ' },
    { title: 'ঈদাইন', titleAr: 'العيدين', category: 'eid', categoryBn: 'ঈদ' },
    { title: 'বিতর', titleAr: 'الوتر', category: 'witr', categoryBn: 'বিতর' },
    { title: 'দোয়া', titleAr: 'الدعاء', category: 'dua', categoryBn: 'দোয়া' },
    { title: 'যিকর', titleAr: 'الذكر', category: 'dhikr', categoryBn: 'যিকর' },
    { title: 'কুরআন তিলাওয়াত', titleAr: 'فضائل القرآن', category: 'quran', categoryBn: 'কুরআন' },
    { title: 'তাফসীর', titleAr: 'التفسير', category: 'tafsir', categoryBn: 'তাফসীর' }
  ],
  muslim: [
    { title: 'ঈমান', titleAr: 'الإيمان', category: 'iman', categoryBn: 'ঈমান' },
    { title: 'তাহারাত', titleAr: 'الطهارة', category: 'purification', categoryBn: 'তাহারাত' },
    { title: 'হায়েয', titleAr: 'الحيض', category: 'menstruation', categoryBn: 'হায়েয' },
    { title: 'সালাত', titleAr: 'الصلاة', category: 'salah', categoryBn: 'সালাত' },
    { title: 'মসজিদ', titleAr: 'المساجد', category: 'mosques', categoryBn: 'মসজিদ' },
    { title: 'মুসাফির সালাত', titleAr: 'صلاة المسافرين', category: 'traveller_prayer', categoryBn: 'মুসাফির সালাত' },
    { title: 'জুমুআ', titleAr: 'الجمعة', category: 'jumuah', categoryBn: 'জুমুআ' },
    { title: 'যাকাত', titleAr: 'الزكاة', category: 'zakat', categoryBn: 'যাকাত' },
    { title: 'সিয়াম', titleAr: 'الصيام', category: 'fasting', categoryBn: 'সিয়াম' }
  ],
  abudawud: [
    { title: 'তাহারাত', titleAr: 'الطهارة', category: 'purification', categoryBn: 'তাহারাত' },
    { title: 'সালাত', titleAr: 'الصلاة', category: 'salah', categoryBn: 'সালাত' },
    { title: 'যাকাত', titleAr: 'الزكاة', category: 'zakat', categoryBn: 'যাকাত' },
    { title: 'সিয়াম', titleAr: 'الصيام', category: 'fasting', categoryBn: 'সিয়াম' },
    { title: 'হজ্জ', titleAr: 'الحج', category: 'hajj', categoryBn: 'হজ্জ' },
    { title: 'বিবাহ', titleAr: 'النكاح', category: 'marriage', categoryBn: 'বিবাহ' },
    { title: 'তালাক', titleAr: 'الطلاق', category: 'divorce', categoryBn: 'তালাক' }
  ],
  tirmidhi: [
    { title: 'তাহারাত', titleAr: 'الطهارة', category: 'purification', categoryBn: 'তাহারাত' },
    { title: 'সালাত', titleAr: 'الصلاة', category: 'salah', categoryBn: 'সালাত' },
    { title: 'জুমুআ', titleAr: 'الجمعة', category: 'jumuah', categoryBn: 'জুমুআ' },
    { title: 'সিয়াম', titleAr: 'الصيام', category: 'fasting', categoryBn: 'সিয়াম' },
    { title: 'যাকাত', titleAr: 'الزكاة', category: 'zakat', categoryBn: 'যাকাত' },
    { title: 'হজ্জ', titleAr: 'الحج', category: 'hajj', categoryBn: 'হজ্জ' },
    { title: 'জানাযা', titleAr: 'الجنائز', category: 'funeral', categoryBn: 'জানাযা' }
  ]
};

// Sample hadiths for offline/error cases
const SAMPLE_HADITHS = [
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    text: 'সমস্ত কাজ নিয়তের উপর নির্ভরশীল, আর প্রত্যেক মানুষ তাই পাবে যা সে নিয়ত করেছে।',
    narrator: 'উমর ইবনুল খাত্তাব (রাঃ)',
  },
  {
    arabic: 'مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ',
    text: 'যে ব্যক্তি আমাদের এই দ্বীনে নতুন কিছু আবিষ্কার করল যা এর অন্তর্ভুক্ত নয়, তা প্রত্যাখ্যাত।',
    narrator: 'আয়েশা (রাঃ)',
  },
  {
    arabic: 'الدِّينُ النَّصِيحَةُ',
    text: 'দ্বীন হল কল্যাণকামিতা।',
    narrator: 'তামীম আদ-দারী (রাঃ)',
  }
];

// Fetch available hadith books
export const fetchHadithBooks = async () => {
  try {
    console.log('Fetching books...');
    const response = await axios.get(`${API_BASE}/collections`);
    console.log('Books response:', response.data);
    return AVAILABLE_BOOKS;
  } catch (error) {
    console.error('Error fetching hadith books:', error);
    return AVAILABLE_BOOKS;
  }
};

// Fetch chapters of a specific book
export const fetchBookChapters = async (bookKey: string) => {
  try {
    console.log('Fetching chapters for book:', bookKey);
    const response = await axios.get(`${API_BASE}/collections/${bookKey}/books`);
    console.log('Chapters response:', response.data);

    // Get predefined chapters for the book
    const bookChapters = BOOK_CHAPTERS[bookKey as keyof typeof BOOK_CHAPTERS] || [];

    if (!response.data?.data) {
      return generateChapters(bookKey, bookChapters);
    }

    return response.data.data.map((chapter: any, index: number) => {
      const predefinedChapter = bookChapters[index] || {};
      return {
        id: String(chapter.bookNumber || index + 1),
        title: predefinedChapter.title || chapter.bookName || `অধ্যায় ${index + 1}`,
        titleAr: predefinedChapter.titleAr || chapter.arabicBookName || `باب ${index + 1}`,
        chapterNumber: chapter.bookNumber || index + 1,
        totalHadith: chapter.numberOfHadith || 50,
        category: predefinedChapter.category || 'general',
        categoryBn: predefinedChapter.categoryBn || CATEGORIES_BENGALI[predefinedChapter.category] || 'সাধারণ'
      };
    });
  } catch (error) {
    console.error('Error fetching book chapters:', error);
    return generateChapters(bookKey, BOOK_CHAPTERS[bookKey as keyof typeof BOOK_CHAPTERS] || []);
  }
};

// Generate chapters for a book
const generateChapters = (bookKey: string, predefinedChapters: any[]) => {
  const book = AVAILABLE_BOOKS.find(b => b.id === bookKey);
  if (!book) return [];

  return Array.from({ length: book.totalChapters }, (_, i) => {
    const predefinedChapter = predefinedChapters[i] || {};
    return {
      id: String(i + 1),
      title: predefinedChapter.title || `অধ্যায় ${i + 1}`,
      titleAr: predefinedChapter.titleAr || `باب ${i + 1}`,
      chapterNumber: i + 1,
      totalHadith: 50,
      category: predefinedChapter.category || 'general',
      categoryBn: predefinedChapter.categoryBn || CATEGORIES_BENGALI[predefinedChapter.category] || 'সাধারণ'
    };
  });
};

// Fetch hadiths from a specific chapter
export const fetchHadiths = async (bookKey: string = 'bukhari', chapterNo: number = 1, page: number = 1) => {
  try {
    console.log('Fetching hadiths for:', { bookKey, chapterNo, page });
    const response = await axios.get(`${API_BASE}/collections/${bookKey}/books/${chapterNo}/hadiths`, {
      params: { page, limit: 10 }
    });
    
    console.log('Hadith response:', response.data);

    if (!response.data?.data) {
      return generateSampleHadiths(page);
    }

    const chapters = BOOK_CHAPTERS[bookKey as keyof typeof BOOK_CHAPTERS] || [];
    const chapter = chapters[chapterNo - 1] || { category: 'general', categoryBn: 'সাধারণ' };

    return response.data.data.map((hadith: any) => ({
      id: String(hadith.hadithNumber),
      title: `হাদিস ${hadith.hadithNumber}`,
      text: hadith.translations?.[0]?.text || SAMPLE_HADITHS[0].text,
      arabic: hadith.arabic || SAMPLE_HADITHS[0].arabic,
      reference: `${bookKey} ${hadith.hadithNumber}`,
      category: chapter.category,
      categoryBn: chapter.categoryBn,
      narrator: hadith.narrator || SAMPLE_HADITHS[0].narrator,
      hadithNo: String(hadith.hadithNumber)
    }));
  } catch (error) {
    console.error('Error fetching hadiths:', error);
    return generateSampleHadiths(page);
  }
};

// Generate sample hadiths for a page
const generateSampleHadiths = (page: number) => {
  return Array.from({ length: 10 }, (_, index) => {
    const sampleIndex = (index + page) % SAMPLE_HADITHS.length;
    const sample = SAMPLE_HADITHS[sampleIndex];
    return {
      id: String((page - 1) * 10 + index + 1),
      title: `হাদিস ${(page - 1) * 10 + index + 1}`,
      text: sample.text,
      arabic: sample.arabic,
      reference: `hadith_${(page - 1) * 10 + index + 1}`,
      category: 'general',
      categoryBn: 'সাধারণ',
      narrator: sample.narrator,
      hadithNo: String((page - 1) * 10 + index + 1)
    };
  });
};

// Get total pages for a chapter
export const getChapterPages = async (bookKey: string, chapterNo: number) => {
  try {
    const response = await axios.get(`${API_BASE}/collections/${bookKey}/books/${chapterNo}`);
    const totalHadiths = response.data?.data?.numberOfHadith || 50;
    return Math.max(1, Math.ceil(totalHadiths / 10));
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    return 5; // Default to 5 pages
  }
};
