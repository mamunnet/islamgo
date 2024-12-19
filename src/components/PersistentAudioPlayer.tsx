import { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

const PersistentAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioState, setAudioState } = useAudio();

  useEffect(() => {
    if (audioRef.current) {
      if (audioState.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error);
          setAudioState((prev: { isPlaying: boolean; currentSurah: number; currentTime: number; duration: number; audioUrl: string }) => 
            ({ ...prev, isPlaying: false })
          );
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioState.isPlaying, audioState.audioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioState((prev: { isPlaying: boolean; currentSurah: number; currentTime: number; duration: number; audioUrl: string }) => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0
      }));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioState((prev: { isPlaying: boolean; currentSurah: number; currentTime: number; duration: number; audioUrl: string }) => ({
        ...prev,
        duration: audioRef.current?.duration || 0
      }));
    }
  };

  const handleEnded = () => {
    setAudioState((prev: { isPlaying: boolean; currentSurah: number; currentTime: number; duration: number; audioUrl: string }) => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
  };

  return (
    <audio
      ref={audioRef}
      src={audioState.audioUrl}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
    />
  );
};

export default PersistentAudioPlayer;
