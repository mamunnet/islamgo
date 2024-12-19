import { useEffect, useRef } from 'react';

const BackgroundAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited && audioRef.current) {
      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.5;
          audioRef.current.play().catch(error => {
            console.error('Failed to play audio:', error);
          });
          localStorage.setItem('hasVisitedBefore', 'true');
        }
        document.removeEventListener('click', playAudio);
      };

      document.addEventListener('click', playAudio);
      return () => document.removeEventListener('click', playAudio);
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="https://cdn.islamic.network/quran/audio/128/ar.alafasy/5741.mp3"
      preload="auto"
    />
  );
};

export default BackgroundAudio;
