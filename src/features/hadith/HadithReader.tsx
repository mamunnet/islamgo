import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHadiths, fetchHadithBooks, fetchBookChapters, getChapterPages, HadithChapter, HadithResponse } from '../../services/hadithService';

const HadithReader = () => {
  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Fetch books
  const { data: books = [] } = useQuery({
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
  const { data: hadiths = [], isLoading: isLoadingHadiths } = useQuery({
    queryKey: ['hadiths', selectedBook, selectedChapter, currentPage],
    queryFn: () => fetchHadiths(selectedBook, selectedChapter, currentPage),
    enabled: !!selectedBook && !!selectedChapter
  });

  // Get total pages when chapter changes
  useEffect(() => {
    const updateTotalPages = async () => {
      const pages = await getChapterPages(selectedBook, selectedChapter);
      setTotalPages(pages);
      setCurrentPage(1); // Reset to first page when chapter changes
    };
    if (selectedBook && selectedChapter) {
      updateTotalPages();
    }
  }, [selectedBook, selectedChapter]);

  const filteredHadiths = hadiths.filter((hadith: {
    text: string;
    arabic: string;
    narrator?: string;
    category?: string;
    hadithNo: string;
  }) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === '' || 
      hadith.text.toLowerCase().includes(searchLower) ||
      hadith.arabic.toLowerCase().includes(searchLower) ||
      hadith.narrator?.toLowerCase().includes(searchLower) ||
      hadith.category?.toLowerCase().includes(searchLower) ||
      hadith.hadithNo.toLowerCase().includes(searchLower)
    );
  });

  const isLoading = isLoadingChapters || isLoadingHadiths;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-[#4E5BA1] text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold mb-4">হাদিস শরীফ</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="হাদিস খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Books Selection */}
        <div className="mb-4 relative">
          <select
            value={selectedBook}
            onChange={(e) => {
              setSelectedBook(e.target.value);
              setSelectedChapter(1);
              setCurrentPage(1);
            }}
            className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {books.map(book => (
              <option key={book.book_key} value={book.book_key} className="bg-white text-gray-800">
                {book.nameBengali}
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
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.chapterNumber)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedChapter === chapter.chapterNumber
                      ? 'bg-white text-[#4E5BA1]'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <span>{chapter.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                    {chapter.categoryBn}
                  </span>
                </button>
              ))}
            </div>
            {/* Scroll Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#4E5BA1] to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#4E5BA1] to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Hadiths List */}
      <div className="bg-white rounded-b-lg shadow-md">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredHadiths.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            কোন হাদিস পাওয়া যায়নি
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredHadiths.map((hadith: HadithResponse) => (
              <div key={hadith.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{hadith.title || `হাদিস নং ${hadith.hadithNo}`}</h3>
                  <div className="flex items-center gap-2">
                    {hadith.category && (
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                        {hadith.category}
                      </span>
                    )}
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {hadith.hadithNo}
                    </span>
                  </div>
                </div>

                <div className="text-right mb-4 font-arabic text-lg leading-loose text-gray-800 dir-rtl">
                  {hadith.arabic}
                </div>
                
                <p className="text-gray-600 mb-3 leading-relaxed">{hadith.text}</p>
                
                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <div>{hadith.reference}</div>
                  {hadith.narrator && <div>বর্ণনায়: {hadith.narrator}</div>}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-[#4E5BA1] text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HadithReader;
