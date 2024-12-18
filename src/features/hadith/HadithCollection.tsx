import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Hadith {
  id: number;
  title: string;
  text: string;
  narrator: string;
  source: string;
}

const collections = [
  { id: 'bukhari', name: 'Sahih al-Bukhari' },
  { id: 'muslim', name: 'Sahih Muslim' },
  { id: 'abudawud', name: 'Sunan Abu Dawud' },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi' },
  { id: 'nasai', name: 'Sunan an-Nasai' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah' },
];

const HadithCollection = () => {
  const [selectedCollection, setSelectedCollection] = useState('bukhari');
  const [page, setPage] = useState(1);

  const { data: hadiths, isLoading } = useQuery({
    queryKey: ['hadiths', selectedCollection, page],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.sunnah.com/v1/collections/${selectedCollection}/hadiths`,
        {
          headers: {
            'X-API-Key': process.env.SUNNAH_API_KEY || '', // You'll need to get an API key from sunnah.com
          },
          params: {
            page,
            limit: 10,
          },
        }
      );
      return response.data.data;
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-islamic-green-800">Hadith Collection</h2>
        <select
          className="p-2 border rounded"
          value={selectedCollection}
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setPage(1);
          }}
        >
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center">Loading hadiths...</div>
      ) : (
        <div className="space-y-6">
          {hadiths?.map((hadith: Hadith) => (
            <div key={hadith.id} className="border-b pb-4 space-y-3">
              <h3 className="font-medium text-islamic-green-800">{hadith.title}</h3>
              <p className="text-gray-700">{hadith.text}</p>
              <div className="text-sm text-gray-600">
                <p>Narrator: {hadith.narrator}</p>
                <p>Source: {hadith.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-islamic-green-100 text-islamic-green-800 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {page}</span>
        <button
          className="px-4 py-2 bg-islamic-green-100 text-islamic-green-800 rounded"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HadithCollection;
