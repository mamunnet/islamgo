import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchHadiths, 
  fetchHadithBooks, 
  fetchBookChapters,
  HadithBook, 
  HadithChapter, 
  HadithResponse 
} from '../../services/hadithService';
import HadithCard from './HadithCard';

const HadithReader = () => {
  const [selectedBook, setSelectedBook] = useState('sahih-bukhari');
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch books
  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['hadithBooks'],
    queryFn: fetchHadithBooks,
    staleTime: Infinity // Books list won't change
  });

  // Fetch chapters for selected book
  const { data: chapters = [], isLoading: isLoadingChapters } = useQuery({
    queryKey: ['hadithChapters', selectedBook],
    queryFn: () => fetchBookChapters(selectedBook),
    enabled: !!selectedBook
  });

  // Fetch hadiths
  const { data: hadithData = { hadiths: [], pagination: { currentPage: 1, lastPage: 1, total: 0 } }, 
          isLoading: isLoadingHadiths,
          error: hadithError
  } = useQuery({
    queryKey: ['hadiths', selectedBook, selectedChapter, currentPage],
    queryFn: () => fetchHadiths(selectedBook, selectedChapter, currentPage, 10),
    enabled: !!selectedBook && !!selectedChapter
  });

  // Reset page when book or chapter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBook, selectedChapter]);

  const filteredHadiths = hadithData.hadiths.filter((hadith: HadithResponse) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      hadith.body?.toLowerCase().includes(searchLower) ||
      hadith.bodyAr?.toLowerCase().includes(searchLower) ||
      hadith.bodyBn?.toLowerCase().includes(searchLower) ||
      hadith.narrator?.toLowerCase().includes(searchLower) ||
      hadith.narratorBn?.toLowerCase().includes(searchLower) ||
      String(hadith.hadithNumber).includes(searchQuery)
    );
  });

  const isLoading = isLoadingBooks || isLoadingChapters || isLoadingHadiths;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header Section */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop")',
            filter: 'brightness(0.2)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-4">হাদিস শরীফ</h1>
        
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="হাদিস খুঁজুন..."
                className="w-full p-2 pl-10 rounded-lg bg-black/30 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Books Selection */}
          <div className="mb-4 relative">
            <select
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setSelectedChapter('1');
              }}
              className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 appearance-none"
            >
              {books.map((book: HadithBook) => (
                <option key={`book-${book.id}-${book.slug}`} value={book.slug} className="bg-white text-gray-800">
                  {book.titleBn || book.title} ({book.numberOfHadith})
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Chapters Selection */}
          {chapters.length > 0 && (
            <div className="relative">
              <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {chapters.map((chapter: HadithChapter) => (
                  <button
                    key={`chapter-${chapter.id}-${chapter.chapterId}`}
                    onClick={() => setSelectedChapter(chapter.chapterId)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
                      selectedChapter === chapter.chapterId
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium shadow-lg'
                        : 'bg-black/30 hover:bg-black/40 text-white'
                    }`}
                  >
                    {chapter.titleBn || chapter.title}
                  </button>
                ))}
              </div>
              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#4E5BA1] to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#4E5BA1] to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>

      {/* Hadiths List */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1000&auto=format&fit=crop")',
            filter: 'brightness(0.2)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 backdrop-blur-sm">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : hadithError ? (
            <div className="p-8 text-center text-red-400">
              Error loading hadiths. Please try again later.
            </div>
          ) : filteredHadiths.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              কোন হাদিস পাওয়া যায়নি
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredHadiths.map((hadith: HadithResponse) => (
                <HadithCard
                  key={`hadith-${hadith.id}-${hadith.bookSlug}-${hadith.hadithNumber}`}
                  hadith={hadith}
                  bookSlug={selectedBook}
                />
              ))}

              {/* Pagination */}
              {hadithData.pagination.lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 p-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="text-white/80">
                    Page {currentPage} of {hadithData.pagination.lastPage}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(hadithData.pagination.lastPage, prev + 1))}
                    disabled={currentPage === hadithData.pagination.lastPage}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HadithReader;