import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrayerTimes from './components/PrayerTimes';
import QuranReader from './features/quran/QuranReader';
import PrayerGuide from './features/prayer/PrayerGuide';
import DailyVerse from './components/DailyVerse';
import IslamicFeatures from './components/IslamicFeatures';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';
import HadithReader from './features/hadith/HadithReader';
import TasbihCounter from './features/tasbih/TasbihCounter';
import IslamicCalendar from './features/calendar/IslamicCalendar';
import QiblaFinder from './features/qibla/QiblaFinder';
import InstallPrompt from './components/InstallPrompt';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function HomePage() {
  return (
    <div className="space-y-6">
      <section>
        <DailyVerse />
      </section>
      
      <section>
        <PrayerTimes />
      </section>
      
      <section>
        <IslamicFeatures />
      </section>
    </div>
  );
}

function QuranPage() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <QuranReader />
    </div>
  );
}

function PrayerPage() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <PrayerTimes />
      </section>
      <section className="bg-white rounded-lg shadow-md overflow-hidden">
        <PrayerGuide />
      </section>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="quran" element={<QuranPage />} />
          <Route path="prayer" element={<PrayerPage />} />
          <Route path="hadith" element={<HadithReader />} />
          <Route path="tasbih" element={<TasbihCounter />} />
          <Route path="calendar" element={<IslamicCalendar />} />
          <Route path="qibla" element={<QiblaFinder />} />
        </Route>
      </Routes>
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
}

export default App;
